import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import { getUserByCustomerID } from '@/models/user';
import { User } from "@/types/user"; // 确保 User 类型定义正确
import { updateUserQuota } from '@/models/quota';

const stripeKey: string | undefined = process.env.STRIPE_PRIVATE_KEY;
const stripeKeyValue: string = stripeKey!; // 非空断言

const stripe = new Stripe(stripeKeyValue, {
  apiVersion: '2023-10-16',
});

const stripeWebHookKey: string | undefined = process.env.STRIPE_WEBHOOK_SECRET;
const stripeWebHookKeyValue: string = stripeWebHookKey!; // 非空断言
const webhookSecret = stripeWebHookKeyValue;

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') || '';
  const body = await req.text(); // Stripe webhooks expect raw body as text

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;

      if (invoice.billing_reason === 'subscription_cycle') {
        const subscriptionId = invoice.subscription;
        console.log('Subscription ID:', subscriptionId);

        if (subscriptionId) {
          // 处理订阅相关的逻辑
        } else {
          console.warn('No subscription ID associated with this invoice');
        }
      } else {
        console.warn('This invoice is not related to a subscription');
      }


      try {
        // Fetch the invoice lines (items purchased)
        const invoiceLines = await stripe.invoices.listLineItems(invoice.id);

        // Prepare to collect product IDs
        const productIds = new Set<string>();

        for (const lineItem of invoiceLines.data) {
          const priceId = lineItem.price?.id;
          if (priceId) {
            // Fetch the price object to get product details
            const price = await stripe.prices.retrieve(priceId);
            const productId = price.product as string;

            // Add product ID to the set
            productIds.add(productId);
          }
        }

        // Convert product IDs set to an array
        const productIdArray = Array.from(productIds);

        // 取得所有 order 所需信息，因为是续费客户，所以首充是存入了 stripe_customer_id,调用 getUserByCustomer，获取 user
        //const user = await getUserByCustomerID(invoice.customer as string);
        const user = await getUserByCustomerID("cus_QeYyRRLU9VpCZU");
        if (!user) {
          console.error('User not found for customer ID:', invoice.customer);
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const planTypes: { [key: number]: string } = {
          590: 'standard',
          1190: 'pro'
        };

        // 根据 invoice.amount_paid 设置 plan 变量
        const current_plan = planTypes[invoice.amount_paid] || 'unknown';

        const currentDate = new Date();
        const oneMonthLater = new Date(currentDate);
        oneMonthLater.setMonth(currentDate.getMonth() + 1);


        const expired_at = oneMonthLater.toISOString();


        const subscription_id = invoice.subscription;



        if (subscription_id === null || typeof subscription_id !== 'string') {
          throw new Error("Invalid subscription ID");
        }


        // Prepare order details
        const orderDetails = {
          // id: invoice.id, // Generate or retrieve this ID as needed
          order_no: invoice.number, // Use invoice number or generate as needed
          created_at: new Date(invoice.created * 1000).toISOString(), // Convert timestamp
          user_email: user.email, // Check if user is fetched successfully
          amount: invoice.amount_paid,
          plan: current_plan, // Determine the plan from invoice lines or other sources
          expired_at: expired_at, // Convert timestamp
          order_status: 2, // Assuming 2 means paid
          paied_at: new Date().toISOString(),
          stripe_session_id: invoice.payment_intent, // Or another relevant ID
          currency: invoice.currency,
          customer_id: invoice.customer as string,
          credits: 0
        };

        // Get Supabase client
        const supabase = await getDb();

        // Insert into Supabase
        const { data, error } = await supabase
          .from('orders')
          .insert([orderDetails]);

        if (error) {
          console.error('Error inserting order:', error);
          throw new Error(`Failed to insert order: ${error.message}`);
        }

        console.log('Order inserted successfully:');

        // 插入 order 之后，就更新用户的 quota
        const quotaByPlan: { [key: string]: { access_content_quota: number, run_ai_quota: number } } = {
          'standard': { access_content_quota: -1, run_ai_quota: 20 },
          'pro': { access_content_quota: -1, run_ai_quota: 50 },
          'unknown': { access_content_quota: 999, run_ai_quota: 999 } //仅用于测试
        };

        // 获取对应的 quota
        const { access_content_quota, run_ai_quota } = quotaByPlan[current_plan] || { access_content_quota: 0, run_ai_quota: 0 };

        // 调用 updateUserQuota 更新用户的 quota
        const userIdAsNumber = Number(user.id);

        if (isNaN(userIdAsNumber)) {
          throw new Error(`Invalid user_id: ${user.id} cannot be converted to a number.`);
        }

        const success = await updateUserQuota(userIdAsNumber, access_content_quota, run_ai_quota);

        if (success) {
          console.log(`User quota updated successfully for plan: ${current_plan}`);
        } else {
          console.log(`Failed to update user quota for plan: ${current_plan}`);
        }

      } catch (err) {
        console.error('Failed to process invoice payment or insert order:', err);
        return NextResponse.json('Error processing invoice payment or inserting order.', { status: 500 });
      }

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@heroicons/react/20/solid";
import { loadStripe } from "@stripe/stripe-js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useContext } from 'react';
import UsageCard from "./UsageCard";
import { getUserQuota, getUserPlan } from "@/models/quota";
import PlanStatusCard from "./PlanStatusCard";
import { AppContext } from '@/contexts/AppContext'; // 确保路径正确
import { getUserCurrentPlanExpiredDate, cancelSubscriptionAtPeriodEnd, getSubscriptionIdByEmail, getSubscriptionStatusByEmail, getUserCurrentPlanExpiredDateFromStripe, getSubscriptionStatusWithPeriodEndByEmail } from '@/models/order'
import { tiers } from "@/config/tiers"
import ConfirmDialog from './ConfirmDialog'; // 确保路径正确

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const PlanPage: React.FC = () => {
  const router = useRouter();
  const { user } = useContext(AppContext); // 从 AppContext 中获取 user 信息
  const [loading, setLoading] = useState(false);
  const [planExpiryDate, setPlanExpiryDate] = useState<string | null>(null);
  const [userQuota, setUserQuota] = useState<{ access_content_quota: number, run_ai_quota: number } | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserQuotaAndPlan = async () => {
      if (!user?.email) return;

      // 获取用户配额
      const quota = await getUserQuota(user.email);
      setUserQuota(quota);

      // 获取用户计划
      const plan = await getUserPlan(user.email);
      setUserPlan(plan);

      // 获取用户订阅状态
      try {
        const subscriptionStatus = await getSubscriptionStatusWithPeriodEndByEmail(user.email);
        setSubStatus(subscriptionStatus);
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      }

      // 获取用户过期时间
      const expiryDate = await getUserCurrentPlanExpiredDateFromStripe(user.email);
      if (expiryDate) {
        setPlanExpiryDate(expiryDate);
      }
    };

    fetchUserQuotaAndPlan();
  }, [user?.email]);

  const handleCheckout = async (
    plan: string,
    amount: number,
    currency: string,

  ) => {
    try {
      const params = {
        plan: plan,

        amount: amount,
        currency: currency,
      };

      setLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.status === 401) {
        setLoading(false);
        toast.error("need login");
        router.push("/sign-in");
        return;
      }

      const { code, message, data } = await response.json();
      if (!data) {
        setLoading(false);
        toast.error(message);
        return;
      }
      const { public_key, session_id } = data;

      const stripe = await loadStripe(public_key);
      if (!stripe) {
        setLoading(false);
        toast.error("checkout failed");
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session_id,
      });
      console.log("result", result);

      if (result.error) {
        setLoading(false);
        toast.error(result.error.message);
      }
    } catch (e) {
      setLoading(false);
      console.log("checkout failed: ", e);
      toast.error("checkout failed");
    }
  };

  const onCancelClick = async () => {
    try {
      if (!user?.email) {
        toast.error("user email is required");
        return;
      }

      const subscriptionId = await getSubscriptionIdByEmail(user.email);
      // console.log("sub id: "+subscriptionId)

      if (!subscriptionId) {
        toast.error("subscription id not found for this user");
        return;
      }

      await cancelSubscriptionAtPeriodEnd(subscriptionId);
      toast.success("subscription set to cancel at period end");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full">
      <div className="container max-w-8xl px-4 mx-auto sm:px-8">
        <div className="py-8">
          <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
            <h2 className="text-2xl leading-tight">plan</h2>
          </div>
          <hr className="border-gray-300" /> {/* Horizontal line */}
          <div>
            {/* Pricing Section */}
            <div className="relative isolate px-6 py-2 md:py-8 lg:px-8">

              <div className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-y-8 sm:mt-12 sm:gap-y-10 lg:max-w-5xl lg:grid-cols-3 lg:gap-x-8">
                {tiers.map((tier, index) => (
                  <div
                    key={tier.id}
                    className="relative shadow-2xl rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10"
                  >
                    <p
                      id={tier.id}
                      className="text-base font-semibold leading-7 text-indigo-600"
                    >
                      {tier.name}
                    </p>
                    <p className="mt-4 flex items-baseline gap-x-2">
                      <span className="text-5xl font-bold tracking-tight text-gray-900">
                        {tier.priceMonthly}
                      </span>
                      <span className="text-base text-gray-500">
                        {tier.unit}
                      </span>
                    </p>
                    <p className="mt-6 text-base leading-7 text-gray-600">
                      {tier.description}
                    </p>
                    <ul
                      role="list"
                      className="mt-8 space-y-3 text-sm leading-6 text-gray-600 sm:mt-10"
                    >
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-indigo-600"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="mt-8 w-full"
                      disabled={loading || index === 0} // 如果是 tier[0]，则禁用按钮
                      onClick={() => {
                        handleCheckout(
                          tier.plan,
                          tier.amount,
                          tier.currency,
   
                        );
                      }}
                    >
                      {loading ? "processing..." : "purchase"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
            <h2 className="text-2xl leading-tight">current plan</h2>
          </div>
          <hr className="my-4 border-gray-300" /> {/* Horizontal line */}

          <div className="flex flex-wrap justify-start space-x-6">
            <PlanStatusCard
              title="current plan"
              value={userPlan ?? ''} // 提供默认值
              footerText={planExpiryDate ?? ''} // 提供默认值
              buttonText="cancel"
              onCancelClick={() => setIsConfirmDialogOpen(true)}
              status={subStatus ?? 'unknown'} // 提供默认值
            />
            <UsageCard
              title="remaining quota"
              usage={[
                {
                  name: 'access to episodes',
                  used: userQuota?.access_content_quota === -1 ? 9999 : userQuota?.access_content_quota ?? 0,
                  total: userPlan === 'free' ? 4 : 9999,
                  colorClass: 'bg-indigo-400',
                },
                {
                  name: 'run ai on episodes',
                  used: userQuota?.run_ai_quota ?? 0, // 提供默认值 0
                  total: userPlan === 'free' ? 0 : userPlan === 'standard' ? 20 : 50,
                  colorClass: 'bg-green-400',
                },
              ]}
            />
          </div>
        </div>

        <ToastContainer />
      </div>

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={() => {
          setIsConfirmDialogOpen(false);
          onCancelClick();
        }}
        title="confirm cancellation"
        message="are you sure you want to cancel your subscription?"
        confirmText="yes, cancel"
        cancelText="no, keep it"
      />
    </div>
  );
};

export default PlanPage;
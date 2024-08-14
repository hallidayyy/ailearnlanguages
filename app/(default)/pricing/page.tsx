"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "@heroicons/react/20/solid";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const tiers = [
  {
    name: "Free",
    id: "free",
    priceMonthly: "$0",
    unit: "Free Plan",
    plan: "free",
    amount: 0,
    currency: "usd",
    credits: 0,
    description: "",
    features: [
      "Limited transcription features",
      "Access to basic tools",
      "Community support",
    ],
    featured: false,
  },
  {
    name: "Standard",
    id: "standard",
    priceMonthly: "$5.9",
    unit: "Per Month",
    plan: "monthly",
    amount: 590,
    currency: "usd",
    credits: 100,
    description: "",
    features: [
      "100 minutes of transcription per month",
      "High-speed transcription",
      "High-quality transcription",
      "AI-assisted learning",
    ],
    featured: true,
    price_id: "prod_QeAHtLsVc15D6z", // Stripe 为 Standard 计划生成的 price_id
  },
  {
    name: "Pro",
    id: "pro",
    priceMonthly: "$11.9",
    unit: "Per Month",
    plan: "monthly",
    amount: 1190,
    currency: "usd",
    credits: 200,
    description: "",
    features: [
      "200 minutes of transcription per month",
      "Priority transcription",
      "High-quality transcription",
      "AI-assisted learning",
      "Premium support",
    ],
    featured: false,
    price_id: "prod_QeAIUDZnh17m6A", // Stripe 为 Standard 计划生成的 price_id
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (
    plan: string,
    amount: number,
    currency: string,
    credits: number
  ) => {
    try {
      const params = {
        plan: plan,
        credits: credits,
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

      if (plan !== "free") {
        const result = await stripe.redirectToCheckout({
          sessionId: session_id,
        });
        console.log("result", result);

        if (result.error) {
          setLoading(false);

          toast.error(result.error.message);
        }
      } else {
        toast.success("You have selected the free plan!");
        router.push("/success");
      }
    } catch (e) {
      setLoading(false);
      console.log("checkout failed: ", e);
      toast.error("checkout failed");
    }
  };

  return (
    <div className="relative isolate bg-white px-6 py-8 md:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-6xl">
          Pricing
        </h1>
      </div>
      <h2 className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        Choose a payment plan, and after completing the payment, you will receive credits for learning
      </h2>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-8 sm:mt-20 sm:gap-y-10 lg:max-w-4xl lg:grid-cols-3 lg:gap-x-8">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="relative bg-white shadow-2xl rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10"
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
              <span className="text-base text-gray-500">{tier.unit}</span>
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
              disabled={loading}
              onClick={() => {
                handleCheckout(
                  tier.plan,
                  tier.amount,
                  tier.currency,
                  tier.credits
                );
              }}
            >
              {loading ? "Processing..." : "Purchase"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
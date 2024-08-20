"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "@heroicons/react/20/solid";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { tiers } from "@/config/tiers"



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
  );
}
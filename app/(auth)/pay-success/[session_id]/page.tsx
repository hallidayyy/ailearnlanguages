import { handleOrderSession } from "@/services/order";
import { redirect } from "next/navigation";
// import { toast } from "sonner";

export default async function ({ params }: { params: { session_id: string } }) {

  console.log("call pay sucess page");
  console.log(params.session_id);
  try {
    await handleOrderSession(params.session_id);
  } catch (e) {
    console.log("handle order session failed: ", e);
    // toast.error("handle order failed");
  }

  redirect("/");
}

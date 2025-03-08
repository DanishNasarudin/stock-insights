import { redirect } from "next/navigation";

type Props = {};

export default function Page({}: Props) {
  redirect("/");
}

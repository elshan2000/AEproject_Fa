"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  inquiryCreateSchema,
  type InquiryCreateInput,
} from "@/lib/validations/inquiry";
import { createInquiryAction } from "@/actions/inquiry";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-destructive">{message}</p>;
}

export function ContactForm({
  productSlug,
  productName,
}: {
  productSlug?: string;
  productName?: string;
}) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InquiryCreateInput>({
    resolver: zodResolver(inquiryCreateSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      message: productName ? `سلام، دربارهٔ «${productName}» سؤال داشتم.` : "",
      productSlug,
    },
  });

  async function onSubmit(values: InquiryCreateInput) {
    const result = await createInquiryAction(values);
    if (result.success) {
      toast({
        title: "پیام شما ارسال شد",
        description: "به‌زودی با شما تماس می‌گیریم.",
      });
      reset({ customerName: "", phone: "", message: "", productSlug });
      return;
    }
    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.[0]) {
          setError(field as keyof InquiryCreateInput, { message: messages[0] });
        }
      }
    }
    toast({ title: "خطا", description: result.error, variant: "destructive" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {productName && (
        <div className="rounded-md bg-secondary/60 px-4 py-3 text-sm">
          دربارهٔ محصول: <span className="font-medium">{productName}</span>
        </div>
      )}
      {/* productSlug travels with the form so the inquiry links to the product */}
      <input type="hidden" {...register("productSlug")} />

      <div>
        <Label htmlFor="customerName">نام و نام خانوادگی</Label>
        <Input id="customerName" className="mt-1.5" {...register("customerName")} />
        <FieldError message={errors.customerName?.message} />
      </div>

      <div>
        <Label htmlFor="phone">شمارهٔ تماس</Label>
        <Input
          id="phone"
          dir="ltr"
          inputMode="tel"
          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
          className="mt-1.5 text-start"
          {...register("phone")}
        />
        <FieldError message={errors.phone?.message} />
      </div>

      <div>
        <Label htmlFor="message">پیام</Label>
        <Textarea id="message" rows={5} className="mt-1.5" {...register("message")} />
        <FieldError message={errors.message?.message} />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        ارسال پیام
      </Button>
    </form>
  );
}

"use client";

import * as z from "zod";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import toast from "react-hot-toast";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object ({
    label: z.string().min(5),
    imageUrl: z.string().min(1)
});

type BillboardFormValues = z.infer<typeof formSchema>

interface BillboardFormProps {
    initData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
    initData
}) => {

    const params = useParams();
    const router = useRouter();
    
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initData ? "Edit Billboard" : "Create Billboard";
    const description = initData ? "Edit Billboard" : "Add a new Billboard";
    const toastMessage = initData ? "Billboard updated" : "Billboard Created";
    const action = initData ? "Save Changes" : "Create";

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initData || {
            label: '',
            imageUrl: ''
        }
    });

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true);
            if (initData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast.success(toastMessage)
        } catch (error: any) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push("/");
            toast.success("Billboard deleted");
        } catch (error) {
            toast.error("Make sure you removed all categories using this Billboard. ")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
    <>
        <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
        <div className="flex items-center justify-between">
            <Heading title={title} description={description}/>
            {initData && (
                <Button disabled={loading} variant="destructive" size="sm" onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4"/>
                </Button>
            )}
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FormField control={form.control} name="label" render={({field}) => (
                    <FormItem>
                        <FormLabel>Background Image</FormLabel>
                        <FormControl>
                            <ImageUpload value={field.value? [field.value] : []} disabled={loading} onChange={(url) => field.onChange(url)} onRemove={() => field.onChange("")}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <div className="grid grid-cols-3 gap-3">
                    <FormField control={form.control} name="label" render={({field}) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Billboard Label"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            <Button disabled={loading} className="ml-auto" type="submit">
                {action}
            </Button>
            </form>
        </Form>
        <Separator />
    </>
    );
};

export default BillboardForm;
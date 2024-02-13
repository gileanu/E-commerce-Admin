"use client";

import * as z from "zod";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import toast from "react-hot-toast";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";
import { Billboard, Category } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object ({
    name: z.string().min(5, {
        message: "Category name must be at least 5 characters long"
    }),
    billboardId: z.string().min(1, {
        message: "Select a Billboard"
    })
});

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
    initData: Category | null;
    billboards: Billboard[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
    initData,
    billboards
}) => {

    const params = useParams();
    const router = useRouter();
    
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initData ? "Edit Category" : "Create Category";
    const description = initData ? "Edit Category" : "Add a new Category";
    const toastMessage = initData ? "Category updated" : "Category Created";
    const action = initData ? "Save Changes" : "Create";

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initData || {
            name: '',
            billboardId: ''
        }
    });

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true);
            if (initData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data);
            }
            router.push(`/${params.storeId}/categories`);
            router.refresh();
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.push(`/${params.storeId}/categories`);
            router.refresh();
            toast.success("Category deleted");
        } catch (error) {
            toast.error("Make sure you removed all products using this Category.")
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
                <div className="grid grid-cols-3 gap-3">
                    <FormField control={form.control} name="name" render={({field}) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input disabled={loading} placeholder="Category name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="billboardId" render={({field}) => (
                        <FormItem>
                        <FormLabel>Billboard</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder="Select a Billboard"> 
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {billboards.map((billboards) => (
                                        <SelectItem key={billboards.id} value={billboards.id}>
                                            {billboards.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            <Button disabled={loading} className="ml-auto" type="submit">
                {action}
            </Button>
            </form>
        </Form>
    </>
    );
};

export default CategoryForm;
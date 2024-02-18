"use client";

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading title={`Orders: (${data.length})`} description="View orders" />
      <Separator />
      <DataTable searchKey="product" columns={columns} data={data} />
    </>
  );
};

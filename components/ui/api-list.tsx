"use client";

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiAlert } from "@/components/ui/api-alert";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}

export const ApiList: React.FC<ApiListProps> = ({
  entityName,
  entityIdName,
}) => {
  const params = useParams();
  const origin = useOrigin();

  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${origin}/api/${params.storeId}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${origin}/api/${params.storeId}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${origin}/api/${params.storeId}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${origin}/api/${params.storeId}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${origin}/api/${params.storeId}/${entityName}/{${entityIdName}}`}
      />
    </>
  );
};

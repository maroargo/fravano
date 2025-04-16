import FormCompany from "@/components/company";
import Link from "next/link";


export default async function Dashboard() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex flex-col gap-6">
        
        <FormCompany />
      </div>
    </div>
  );
}

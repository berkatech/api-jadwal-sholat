import { getProvinces } from "@/app/lib/adapter/bimaskemenag";

export async function GET() {
    const provinces = await getProvinces();

    return Response.json({
        message: "success",
        data: provinces,
    });
}
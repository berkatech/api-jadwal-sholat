import { getProvinces } from "@/app/lib/adapter/bimaskemenag";

export async function GET() {
    try {
        const provinces = await getProvinces();

        return Response.json({
            message: "success",
            data: provinces,
        });
    } catch (error) {
        console.error('Failed to fetch provinces:', error);
        return Response.json(
            {
                message: "error",
                error: error instanceof Error ? error.message : 'failed to fetch provinces'
            },
            { status: 500 }
        );
    }
}
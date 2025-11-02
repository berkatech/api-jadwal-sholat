import { getCities } from "@/app/lib/adapter/bimaskemenag";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const province_id = searchParams.get("province_id");
    if (!province_id) {
        return Response.json({
            message: "error",
            error: "missing required parameter province_id"
        }, {
            status: 400
        });
    }

    try {
        const cities = await getCities({ province_id });

        return Response.json({
            message: 'success',
            data: cities
        });
    } catch (error) {
        console.error('Failed to fetch cities:', error);
        return Response.json({
            message: "error",
            error: error instanceof Error ? error.message : 'failed to fetch cities'
        }, {
            status: 500
        });
    }
}
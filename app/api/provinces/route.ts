import got from "got";
import { NextRequest } from "next/server";
import { JSDOM } from 'jsdom';
import { getProvinces } from "@/app/lib/adapter/bimaskemenag";

export async function GET(request: NextRequest) {
    const provinces = await getProvinces();

    return Response.json({
        message: "success",
        data: provinces,
    });
}
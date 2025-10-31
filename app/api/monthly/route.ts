import { getSchedules } from '@/app/lib/adapter/bimaskemenag';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const province_id = searchParams.get("province_id");
    const city_id = searchParams.get("city_id");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!province_id || !city_id || !month || !year) {
        return Response.json({
            message: "error",
            error: "missing required parameters"
        }, {
            status: 400
        });
    }

    try {
        const kemenagResponse = await getSchedules({
            province_id: province_id,
            city_id: city_id,
            month: month,
            year: year
        });

        const schedules: Array<{
            date: string;
            imsyak: string;
            shubuh: string;
            sunrise: string;
            dhuha: string;
            dzuhur: string;
            ashr: string;
            maghrib: string;
            isya: string;
        }> = [];

        for (const date in kemenagResponse.data) {
            const row = kemenagResponse.data[date];
            schedules.push({
                date: date,
                imsyak: row.imsak,
                shubuh: row.subuh,
                sunrise: row.terbit,
                dhuha: row.dhuha,
                dzuhur: row.dzuhur,
                ashr: row.ashar,
                maghrib: row.maghrib,
                isya: row.isya,
            })
        }

        const resp = {
            message: "success",
            data: {
                province: kemenagResponse.prov,
                city: kemenagResponse.kabko,
                schedules: schedules,
            }
        };
        return Response.json(resp);
    } catch (error) {
        return Response.json({
            message: "error",
            error: error instanceof Error ? error.message : "failed to fetch schedules",
        }, {
            status: 500,
        });
    }
}
import { getSchedules } from "@/app/lib/adapter/bimaskemenag";
import { formatDate, validateDate } from "@/app/lib/util/date";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const province_id = searchParams.get("province_id");
    const city_id = searchParams.get("city_id");
    const date = searchParams.get("date");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!province_id || !city_id || !date || !month || !year) {
        return Response.json({
            message: "error",
            error: "missing required parameters"
        }, {
            status: 400
        });
    }

    // Validate date parameters
    const errorDate = validateDate(year, month, date)
    if (errorDate !== null) {
        return Response.json({
            message: "error",
            error: errorDate.message
        }, {
            status: 400
        });
    }

    try {
        const kemenagResponse = await getSchedules({
            province_id,
            city_id,
            month,
            year
        });

        let schedule: {
            date: string;
            imsyak: string;
            shubuh: string;
            sunrise: string;
            dhuha: string;
            dzuhur: string;
            ashr: string;
            maghrib: string;
            isya: string;
        } | null = null;

        // validate response structure
        if (!kemenagResponse.data || typeof kemenagResponse.data !== 'object') {
            return Response.json({
                message: "error",
                error: "invalid response structure from external API"
            }, {
                status: 502,
            });
        }

        const filterDate = formatDate(year, month, date);

        const scheduleItem = kemenagResponse.data[filterDate];
        if (!scheduleItem) {
            return Response.json({
                message: "error",
                error: "schedule not found"
            }, {
                status: 404
            });
        }

        schedule = {
            date: filterDate,
            imsyak: scheduleItem.imsak,
            shubuh: scheduleItem.subuh,
            sunrise: scheduleItem.terbit,
            dhuha: scheduleItem.dhuha,
            dzuhur: scheduleItem.dzuhur,
            ashr: scheduleItem.ashar,
            maghrib: scheduleItem.maghrib,
            isya: scheduleItem.isya,
        }

        const resp = {
            message: "success",
            data: {
                province: kemenagResponse.prov,
                city: kemenagResponse.kabko,
                schedule: schedule,
            }
        }
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
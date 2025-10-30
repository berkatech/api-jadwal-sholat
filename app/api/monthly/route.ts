import got from 'got';
import { JSDOM } from 'jsdom';
import { NextRequest } from 'next/server';

interface KemenagScheduleResponse {
    data: {
        [date: string]: {
            tanggal: string,
            ashar: string,
            dhuha: string,
            dzuhur: string,
            imsak: string,
            isya: string,
            maghrib: string,
            subuh: string,
            terbit: string,
        }
    }
    prov: string,
    kabko: string,
}

export async function GET(request: NextRequest) {
    // get cookies
    const page = await got.get('https://bimasislam.kemenag.go.id/web/jadwalshalat');
    const cookies = page.headers['set-cookie'] || [];
    console.log(cookies);

    const { searchParams } = request.nextUrl;

    // get schedule
    const kemenagRequest = got.post('https://bimasislam.kemenag.go.id/web/ajax/getShalatbln', {
        form: {
            x: searchParams.get("province_id"),
            y: searchParams.get("city_id"),
            bln: searchParams.get("month"),
            thn: searchParams.get("year"),
        },
        headers: {
            'Cookie': cookies
        }
    });

    const kemenagResponse: KemenagScheduleResponse = await kemenagRequest.json();

    const schedule = [];

    for (const date in kemenagResponse.data) {
        const row = kemenagResponse.data[date];
        schedule.push({
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
            schedule: schedule,
        }
    };

    return Response.json(resp);
}
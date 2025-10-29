import got from 'got';
import { JSDOM } from 'jsdom';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const page = await got.get('https://jadwalsholat.org/jadwal-sholat/monthly.php', {
        searchParams
    });
    const dom = new JSDOM(page.rawBody).window;
    const table = dom.document.querySelector('table.table_adzan')!;
    const rows = table.querySelectorAll('tr.table_light, tr.table_dark');

    const month_year = table.querySelector('tr.table_title td h2')?.textContent.split(" ");
    const month = month_year?.at(0);
    const year = month_year?.at(1);
    const location = table.querySelector("select.inputcity option[selected]")?.textContent

    const schedule = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const values = row.querySelectorAll("td")
        schedule.push({
            tanggal: parseInt(values[0]?.textContent),
            imsyak: values[1]?.textContent,
            shubuh: values[2]?.textContent,
            terbit: values[3]?.textContent,
            dhuha: values[4]?.textContent,
            dzuhur: values[5]?.textContent,
            ashr: values[6]?.textContent,
            maghrib: values[7]?.textContent,
            isya: values[8]?.textContent,
        })
    }

    const resp = {
        kota: location,
        bulan: month,
        tahun: year,
        jadwal: schedule,
    };

    return Response.json(resp);
}
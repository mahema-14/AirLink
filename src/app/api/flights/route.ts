import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { executeCypherQuery } from '@/lib/neo4j';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const mode = searchParams.get('mode') || 'sql';

  try {
    if (mode === 'graph' && origin && destination) {
      const cypherQuery = `
        MATCH (orig:Airport {code: $origin}), (dest:Airport {code: $destination})
        MATCH path = shortestPath((orig)-[:HAS_FLIGHT*..3]->(dest))
        RETURN path
      `;
      const graphResults = await executeCypherQuery(cypherQuery, { origin, destination });
      return NextResponse.json({ mode: 'graph', paths: graphResults });
    }

    let sql = `
      SELECT f.flight_id, f.flight_number, f.departure_time, f.arrival_time, f.base_fare, f.flight_status,
             sa.airport_code AS origin_code, sa.city AS origin_city,
             da.airport_code AS dest_code, da.city AS dest_city
      FROM flights f
      JOIN airports sa ON f.source_airport_id = sa.airport_id
      JOIN airports da ON f.destination_airport_id = da.airport_id
    `;
    const params: string[] = [];

    if (origin && destination) {
      sql += ` WHERE sa.airport_code = ? AND da.airport_code = ?`;
      params.push(origin, destination);
    }

    sql += ` ORDER BY f.departure_time ASC`;

    const [flights]: any = await pool.query(sql, params);
    return NextResponse.json({ mode: 'sql', flights });
  } catch (error: any) {
    console.error('API /api/flights Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch flights' }, { status: 500 });
  }
}
import sql from '@/lib/db';

export async function GET() {
  try {
    const countResult = await sql`SELECT COUNT(*) AS count FROM submissions WHERE status = 'success'`;
    const submissionCount = 100 + parseInt(countResult[0].count);

    return Response.json({ submission_count: submissionCount }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching submission count:', error);
    return Response.json(
      { error: 'Failed to fetch submission count', submission_count: 100 },
      { status: 500 }
    );
  }
}

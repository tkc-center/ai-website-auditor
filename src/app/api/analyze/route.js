export async function POST(req) {

  try {

    const body = await req.json();
    const url = body.url;

    const apiKey =
      process.env.GOOGLE_API_KEY;

    const apiUrl =
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${apiKey}`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    return Response.json(data);

  } catch (error) {

    return Response.json({
      error: error.message,
    });
  }
}
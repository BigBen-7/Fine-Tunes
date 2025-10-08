// app/api/generate/route.ts

// FINAL, CORRECTED VERSION

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Gemini API key not configured." }),
      { status: 500 }
    );
  }
  if (!prompt) {
    return new Response(JSON.stringify({ error: "Prompt is required." }), {
      status: 400,
    });
  }

  // THE FIX: Use the exact model name confirmed to be available for your key.
  const modelName = "gemini-2.5-flash";

  // We will use the v1beta endpoint as it is the most common for generateContent.
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const fullPrompt = `You are an expert music curator. Based on the following prompt, create a playlist of 10 songs.
  Prompt: "${prompt}"
  For each song, provide the track name, album, album art or artist picture and the artist's name.
  Respond with ONLY a valid JSON array of objects in the following format:
  [{"song": "Song Name 1", "artist": "Artist Name 1"}, ...]`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: fullPrompt,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        errorBody.error.message || "Request to Google API failed"
      );
    }

    const result = await response.json();
    const text = result.candidates[0]?.content?.parts[0]?.text;

    if (!text) {
      throw new Error("AI did not return any text content.");
    }

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("AI did not return a valid JSON array.");
    }

    const jsonResponse = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Full error object from API call:", error);
    return new Response(
      JSON.stringify({ error: `Server Error: ${error.message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

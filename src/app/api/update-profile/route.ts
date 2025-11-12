export async function POST(req: Request) {
  const formData = await req.formData();
  const name = formData.get("name");
  const avatar = formData.get("avatar");

  // Save to DB + update session
  return Response.json({ success: true });
}
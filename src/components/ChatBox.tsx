async function send() {
  if (!input.trim()) return;

  setMessages((m) => [...m, { role: "user", content: input }]);
  const question = input;
  setInput("");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question }),
    });

    const data = await res.json();
    const content = data.text || data.error || "Unknown error";
    setMessages((m) => [...m, { role: "assistant", content }]);
  } catch (e: any) {
    setMessages((m) => [
      ...m,
      { role: "assistant", content: `Request failed: ${e?.message || e}` },
    ]);
  }
}

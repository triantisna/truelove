export async function saveWebsiteResponse(
  websiteId: string | undefined,
  payload: Record<string, unknown>,
): Promise<boolean> {
  const normalizedId = websiteId?.trim().toLowerCase() ?? '';

  if (
    !normalizedId ||
    normalizedId === 'preview' ||
    normalizedId.startsWith('preview-') ||
    normalizedId.startsWith('mock') ||
    normalizedId.startsWith('demo')
  ) {
    return true;
  }

  try {
    const res = await fetch(
      `/api/websites/${encodeURIComponent(websiteId!)}/response`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    return res.ok;
  } catch (err) {
    console.error('Gagal mengirim respons ke server:', err);
    return false;
  }
}

// GitHub camo often gets 404/503 from komarev directly; relay through this worker instead.
export default {
  async fetch(request) {
    const params = new URL(request.url).searchParams;
    params.set('username', 'Leon24k'); // pinned so this can't be used as an open proxy
    const res = await fetch(`https://komarev.com/ghpvc/?${params}`, {
      headers: {
        'user-agent': request.headers.get('user-agent') || 'ghpvc-proxy',
        // komarev throttles per IP; pass the real client (camo) IP so views aren't collapsed into ours
        'x-forwarded-for': request.headers.get('cf-connecting-ip') || '',
      },
    });
    return new Response(res.body, {
      status: res.status,
      headers: {
        'content-type': 'image/svg+xml',
        'cache-control': 'max-age=0, no-cache, no-store, must-revalidate',
      },
    });
  },
};

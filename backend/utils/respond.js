export function ok(res, data, meta) {
  return res.status(200).json(meta ? { data, meta } : { data });
}

export function created(res, data) {
  return res.status(201).json({ data });
}

export function noContent(res) {
  return res.status(204).end();
}

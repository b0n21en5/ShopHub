export function NotFound(res, mess = "") {
  return res.status(404).send({ success: false, message: mess });
}

export function serverError(res, err, mess = "") {
  console.log(err);
  return res.status(500).send({ success: false, message: mess });
}

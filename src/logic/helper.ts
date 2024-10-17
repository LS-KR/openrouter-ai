import { OpenRequest, OpenResponse } from '@/logic/data'

export async function complete(request: OpenRequest, auth: string): Promise<OpenResponse> {
  return JSON.parse(await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + auth,
    },
    body: JSON.stringify(request),
  }).then(it => it.text())) as OpenResponse;
}

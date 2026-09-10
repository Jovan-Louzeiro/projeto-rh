export async function listarSexos(token: string) {
  return fetch("https://projeto-rh-sj48.onrender.com/api/sexos", {
    method: "GET",
    headers: {
      authorization: "Bearer " + token
    }
  }).then (response => {
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return response.json();
  });
} 


console.log( await listarSexos("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywicGVybWlzc2FvIjoiQURNSU4iLCJpYXQiOjE3ODkwNDgyNjAsImV4cCI6MTc4OTA3NzA2MH0.sc3WdTQo0iHzbPT5TQtflBbdbMwCuYMYZajRtn0WWfE"));
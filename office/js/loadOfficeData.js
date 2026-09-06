export async function loadJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }

  return response.json();
}

export async function loadStarterOfficeBundle() {
  const [office, staff, goals] = await Promise.all([
    loadJson("./data/starter-office.json"),
    loadJson("./data/staff.json"),
    loadJson("./data/goals.json"),
  ]);

  return { office, staff, goals };
}

export function staffById(staffList) {
  const byId = {};

  for (const person of staffList) {
    byId[person.id] = person;
  }

  return byId;
}

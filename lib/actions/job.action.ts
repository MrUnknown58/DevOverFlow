// import { revalidatePath } from "next/cache";
import { JobFilterParams } from "./shared.types";

interface cityInfo {
  name: string;
  value: string;
}
export async function getUserCountry() {
  const res = await fetch("https://ipapi.co/json/");
  const response = await res.json();
  console.log(response);
  // get cities from country
  const res1 = await fetch(
    "https://restcountries.com/v3.1/independent?status=true"
  );
  const response1 = await res1.json();
  const cities = response1.map((city: any) => ({
    name: city.name.common,
    value: city.name.common,
  }));
  // sort cities by name
  cities.sort((a: cityInfo, b: cityInfo) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  // console.log(cities);
  return {
    userLocation: response,
    country: response.country_name,
    cities,
  };
}

export const fetchJobs = async (filters: JobFilterParams) => {
  const { query, page } = filters;

  const headers = {
    "X-RapidAPI-Key": process.env.NEXT_RAPID_API_KEY ?? "",
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  };

  const reponse = await fetch(
    `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}`,
    {
      headers,
    }
  );

  const result = await reponse.json();
  // console.log(result.data);
  // revalidatePath("/jobs");
  return result.data;
};

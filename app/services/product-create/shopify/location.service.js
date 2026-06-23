export async function getLocations(admin){
   return await admin.request(`
      query {
        locations(first: 10) {
          edges { node { id name } }
        }
      }
    `);
}
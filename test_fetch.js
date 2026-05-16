async function test() {
  const response = await fetch('http://localhost:5001/doctors');
  const data = await response.json();
  const filteredDoctors = data.filter(doc => doc.department === 'Cardiology');
  console.log("Filtered length:", filteredDoctors.length);
  console.log(filteredDoctors[0].department);
}
test();

import { generateData } from '../lib/dataGenerator';

export default function HomePage() {
  const data = generateData(10);
  return (
    <main>
      <h1>Sample Data</h1>
      <ul>
        {data.map((dp, idx) => (
          <li key={idx}>
            Timestamp: {dp.timestamp} Value: {dp.value}
          </li>
        ))}
      </ul>
    </main>
  );
}

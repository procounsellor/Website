import AlumniCard from './AlumniCard';

const ALUMNI_DATA = [
  {
    id: 1,
    name: "Vinod Khosla",
    batch: "B.Tech, Class of 1976",
    position: "Co-founder, Sun Microsystems",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkLmRPj1RJ41GmktRg949JgN-tiaKwLFZ2BWWhlKBmILucG0w65heA11Q10M_ECsqZQWZUNeQ7yp--Zjw-4F8D2f_gk59W-snLwEHzqDIwMA&s=10"
  },
  {
    id: 2,
    name: "Sachin Bansal",
    batch: "B.Tech, Class of 2005",
    position: "Co-founder, Flipkart",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV7b3UdIQSl-feXiZGz-Z1OK9cziCy7G2CzZQUApO48EEYdra8dslrnZO_TfjmwLAXt7b3sKXFu8QiKDR9gk0ciAsJHPVQo0KDZ8f9BNKA&s=10"
  },
  {
    id: 3,
    name: "Raghuram Rajan",
    batch: "B.Tech, Class of 1985",
    position: "Ex-Governor, RBI",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXp0Okz0Sx1gvKnxx2HZwyD-UnAaVRQNgjlB8tnoXObucCD2XWLXKFoNUQ7yvj_k5HOX5kWkIzUBpA7h6LHson_vxsixagzKY34DbUXvRr4g&s=10"
  },
  {
    id: 4,
    name: "Deepinder Goyal",
    batch: "M.Tech, Class of 2005",
    position: "Founder & CEO, Zomato",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq-Y6jlVcJBjaoMLX_ZMlABZrlds2DzcHUFUkoHm5EomMa7UdHT650IQJgY11PVGHrqj-efkP72WO4-ULZFhBJd5F-DqeYWKT_D8SmM3Lbzg&s=10"
  }
];

const AluminiTab = () => {
  return (
    <div className="w-full grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-[23px] md:justify-start">
      {ALUMNI_DATA.map((alumni) => (
        <AlumniCard
          key={alumni.id}
          name={alumni.name}
          batch={alumni.batch}
          position={alumni.position}
          imageUrl={alumni.image}
        />
      ))}
    </div>
  );
};

export default AluminiTab;
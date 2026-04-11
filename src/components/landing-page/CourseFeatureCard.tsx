interface CourseFeature {
  title: string;
  description: string;
}

interface CourseFeatureCardProps {
  feature: CourseFeature;
}

export function CourseFeatureCard({ feature }: CourseFeatureCardProps) {
  return (
    <div
      className="w-full h-[269px] p-5"
      style={{
        width: '420px',
        height: '269px',
        borderRadius: '8px',
        background: '#13097D0D',
        padding: '0', 
      }}
    >
      <h3
        className="text-center py-5 px-10 text-nowrap text-clip"
        style={{
          fontFamily: 'Poppins',
          fontWeight: 500,
          fontSize: '18px',
          lineHeight: '125%',
          color: '#13097D',
          paddingTop: '20px',
          paddingLeft: '60px',
          paddingBottom: '12px',
          // width: '100%',
        }}
      >
        {feature.title}
      </h3>

      <div
        style={{
          width: '380px',
          height: '0px',
          borderTop: '1px solid #13097D33',
          margin: '0 auto',
        }}
      ></div>

      <div
        className="pt-3"
        style={{
          width: '388px',
          height: '175px',
          margin: '0 auto',
        }}
      >
        <p
          className="text-center"
          style={{
            fontFamily: 'Poppins',
            fontWeight: 500,
            fontSize: '18px',
            lineHeight: '125%',
            color: '#232323',
          }}
        >
          {feature.description}
        </p>
      </div>
    </div>
  );
}
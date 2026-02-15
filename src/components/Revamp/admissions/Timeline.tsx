import { useEffect, useRef, useState } from 'react';

interface TimelineItemProps {
  month: string;
  title: string;
  subtitle?: string;
  iconUrl: string;
  position: 'top' | 'bottom';
  index: number;
}

const TimelineItem = ({ month, title, subtitle, iconUrl, position, index }: TimelineItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Slower delay - each item animation based on its index
          setTimeout(() => {
            setIsVisible(true);
          }, index * 200);
        }
      },
      { threshold: 0.1 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, [index]);

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${60 + index * 151}px`,
    top: '200px',
    width: '151px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : `translateY(${position === 'bottom' ? '30px' : '-30px'})`,
    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
  };

  return (
    <div ref={itemRef} style={containerStyle}>
      {/* Icon on the line */}
      <div style={{
        width: '40px',
        height: '40px',
        backgroundColor: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: `2px solid #6366F1`,
        zIndex: 10,
        transform: 'translateY(-50%)',
      }}>
        <img 
          src={iconUrl}
          alt={title}
          style={{
            width: '24px',
            height: '24px',
            objectFit: 'contain',
          }}
        />
      </div>

      {position === 'bottom' ? (
        // Bottom items: icon -> month -> connector -> text
        <>
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '18px',
            color: '#6366F1',
            textAlign: 'center',
            margin: '12px 0 0 0',
            whiteSpace: 'nowrap',
          }}>
            {month}
          </p>
          
          <div style={{
            width: '2px',
            height: '40px',
            backgroundColor: '#E5E7EB',
            margin: '8px 0',
          }} />
          
          <div style={{
            textAlign: 'center',
            width: '151px',
          }}>
            <p style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              color: '#1A1A1A',
              margin: 0,
            }}>
              {title}
            </p>
            {subtitle && (
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#6B7280',
                margin: '4px 0 0 0',
              }}>
                {subtitle}
              </p>
            )}
          </div>
        </>
      ) : (
        // Top items: text -> connector -> month -> icon (reversed)
        <>
          <div style={{
            textAlign: 'center',
            width: '151px',
            transform: 'translateY(-100%)',
            position: 'absolute',
            bottom: '20px',
          }}>
            <p style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              color: '#1A1A1A',
              margin: 0,
            }}>
              {title}
            </p>
            {subtitle && (
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#6B7280',
                margin: '4px 0 0 0',
              }}>
                {subtitle}
              </p>
            )}
          </div>
          
          <div style={{
            width: '2px',
            height: '40px',
            backgroundColor: '#E5E7EB',
            position: 'absolute',
            bottom: '60px',
          }} />
          
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '18px',
            color: '#6366F1',
            textAlign: 'center',
            margin: 0,
            whiteSpace: 'nowrap',
            position: 'absolute',
            bottom: '100px',
          }}>
            {month}
          </p>
        </>
      )}
    </div>
  );
};

export default function Timeline() {
  const [lineWidth, setLineWidth] = useState(0);

  useEffect(() => {
    // Start line animation after component mounts
    const timer = setTimeout(() => {
      setLineWidth(100);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const timelineData = [
    {
      month: 'Dec-Jan',
      title: 'Exam Preps & \nPre Boards',
      iconUrl: 'https://www.figma.com/api/mcp/asset/9aaaa4e9-cf3f-4429-96f0-693f23e229ac',
      position: 'bottom' as const,
    },
    {
      month: 'Feb-Mar',
      title: 'Board Exams',
      iconUrl: 'https://www.figma.com/api/mcp/asset/c459ce51-b194-4bc7-b4af-6cbae7fd7fa7',
      position: 'top' as const,
    },
    {
      month: 'Mar-Apr',
      title: 'Entrance Exam',
      subtitle: '(JEE, NEET)',
      iconUrl: 'https://www.figma.com/api/mcp/asset/9aaaa4e9-cf3f-4429-96f0-693f23e229ac',
      position: 'bottom' as const,
    },
    {
      month: 'May-Jun',
      title: 'Registration',
      iconUrl: 'https://www.figma.com/api/mcp/asset/27bb2bd5-77bb-4499-b5ea-15ab73e1a51d',
      position: 'top' as const,
    },
    {
      month: 'Jun-Jul',
      title: 'Document verification',
      iconUrl: 'https://www.figma.com/api/mcp/asset/c6f15257-00bc-4097-8eb8-f0d6e362a03d',
      position: 'bottom' as const,
    },
    {
      month: 'Jul-Aug',
      title: 'Seat Allotments/CAP',
      iconUrl: 'https://www.figma.com/api/mcp/asset/448e9867-e3a5-433e-8a8a-83b47c28acd7',
      position: 'top' as const,
    },
    {
      month: 'Aug-Sep',
      title: 'Non CAP/ SPOT/IL Rounds',
      iconUrl: 'https://www.figma.com/api/mcp/asset/4b04085f-f603-4b8e-a055-6da4f7479550',
      position: 'bottom' as const,
    },
    {
      month: 'Sep-Oct',
      title: 'Start of Academic year',
      iconUrl: 'https://www.figma.com/api/mcp/asset/0e2d865a-1345-421b-aab5-ed35cb2c8d08',
      position: 'top' as const,
    },
    {
      month: 'Aug-Sep',
      title: 'Assistance with hostel, loans, internships, placements, and further studies',
      iconUrl: 'https://www.figma.com/api/mcp/asset/04ccbbf4-202e-4c06-9b33-04509df9465a',
      position: 'bottom' as const,
    },
  ];

  return (
    <div style={{
      width: '100%',
      minHeight: '500px',
      backgroundColor: '#C6DDF040',
      position: 'relative',
      overflow: 'visible',
      padding: '80px 0 100px 0',
      display: 'flex',
      justifyContent: 'center',
    }}>
      {/* Horizontal line - full screen width animating left to right */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '280px',
          left: '0',
          width: `${lineWidth}vw`,
          height: '1px',
          background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 50%, #FF6B35 100%)',
          zIndex: 1,
          transition: 'width 2s ease-out',
        }} />
      </div>

      {/* Container to center timeline items */}
      <div style={{
        position: 'relative',
        width: '1419px',
        maxWidth: '100%',
        height: '400px',
        margin: '0 auto',
      }}>
        {/* Title */}
        <p style={{
          position: 'absolute',
          top: '0px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700,
          fontSize: '28px',
          color: '#0E1629',
          textAlign: 'center',
          maxWidth: '1061px',
          width: '100%',
          margin: 0,
          marginBottom: '60px',
        }}>
          Procounsel Role in your Journey
        </p>

        {/* Timeline items */}
        {timelineData.map((item, index) => (
          <TimelineItem
            key={index}
            {...item}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export const generateTimeSlots = (
  startHour: number, 
  endHour: number, 
  stepMinutes: number
): { value: string; label: string }[] => {
  const slots: { value: string; label: string }[] = [];
  const pad = (num: number) => num.toString().padStart(2, '0');

  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      if (h === endHour && m > 0) break;

      const hour24 = h;
      const minute = m;
      
      const value = `${pad(hour24)}:${pad(minute)}`;
      
      const ampm = hour24 >= 12 ? 'PM' : 'AM';
      const displayHour = hour24 % 12 || 12;
      const label = `${displayHour}:${pad(minute)} ${ampm}`;

      slots.push({ value, label });

      if (h === endHour && m === 0) break;
    }
  }
  return slots;
};
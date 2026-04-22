export type Barber = {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
};

export const barbers: Barber[] = [
  {
    id: "b1",
    name: "Энхбат",
    title: "Senior Barber",
    imageUrl:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&h=920&crop=faces",
  },
  {
    id: "b2",
    name: "Батбаяр",
    title: "Master Stylist",
    imageUrl:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=700&h=920&crop=faces",
  },
  {
    id: "b3",
    name: "Төмөр",
    title: "Barber",
    imageUrl:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=700&h=920&crop=faces",
  },
];

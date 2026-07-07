export type AppointmentStatus =
  | "AWAITING_PAYMENT"
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

export type Database = {
  public: {
    Tables: {
      barbers: {
        Row: {
          id: string;
          name: string;
          title: string;
          image_url: string | null;
          bio: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          title: string;
          image_url?: string | null;
          bio?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          title?: string;
          image_url?: string | null;
          bio?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          price_mnt: number;
          image_url: string | null;
          in_stock: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description: string;
          price_mnt: number;
          image_url?: string | null;
          in_stock?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string;
          price_mnt?: number;
          image_url?: string | null;
          in_stock?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          barber_id: string;
          customer_name: string;
          customer_phone: string;
          starts_at: string;
          ends_at: string;
          status: AppointmentStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barber_id: string;
          customer_name: string;
          customer_phone: string;
          starts_at: string;
          ends_at: string;
          status?: AppointmentStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          barber_id?: string;
          customer_name?: string;
          customer_phone?: string;
          starts_at?: string;
          ends_at?: string;
          status?: AppointmentStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
  };
};

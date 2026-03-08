
CREATE TABLE public.cellar_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  wine_id uuid REFERENCES public.wines(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  location text,
  purchase_date date,
  purchase_price numeric(10,2),
  drink_by date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, wine_id)
);

ALTER TABLE public.cellar_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own inventory" ON public.cellar_inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own inventory" ON public.cellar_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own inventory" ON public.cellar_inventory FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own inventory" ON public.cellar_inventory FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_cellar_inventory_updated_at
  BEFORE UPDATE ON public.cellar_inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

import { supabase } from "../lib/supabase";

export default async function submitSession(
  session,
  duration,
  items_list,
  usingItems,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: sessionData, error } = await supabase
    .from("practice_sessions")
    .insert({
      user_id: user.id,
      title: session.title,
      duration: duration,
      rating: session.rating,
      description: session.description,
      improved: session.improved,
    })
    .select();
  console.log("data: ", sessionData);
  console.log("error ", error);

  if (usingItems) {
    const itemsToInsert = items_list.map((item, index) => ({
      session_id: sessionData[0].id,
      item_name: item.name,
      duration: item.duration,
      position: index,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from("session_items")
      .insert(itemsToInsert)
      .select();

    console.log("item data: ", itemsData);
    console.log("item error: ", itemsError);
  }

  if (!error) {
    return "/home";
  }

  return "/";
}

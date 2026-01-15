import { supabase } from "./supabase";

const GLOBAL_CONVERSATION_ID = "00000000-0000-0000-0000-000000000001";

// ============================================
// Friend Management
// ============================================

export async function sendFriendRequest(addresseeId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("friendships")
    .insert({
      requester_id: user.id,
      addressee_id: addresseeId,
      status: "pending"
    })
    .select()
    .single();

  return error ? { success: false, error: error.message } : { success: true, data };
}

export async function acceptFriendRequest(friendshipId) {
  const { data, error } = await supabase
    .from("friendships")
    .update({ status: "accepted" })
    .eq("id", friendshipId)
    .select()
    .single();

  return error ? { success: false, error: error.message } : { success: true, data };
}

export async function declineFriendRequest(friendshipId) {
  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("id", friendshipId);

  return error ? { success: false, error: error.message } : { success: true };
}

export async function removeFriend(friendshipId) {
  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("id", friendshipId);

  return error ? { success: false, error: error.message } : { success: true };
}

export async function blockUser(userId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // Check if friendship exists
  const { data: existing } = await supabase
    .from("friendships")
    .select("id")
    .or(`and(requester_id.eq.${user.id},addressee_id.eq.${userId}),and(requester_id.eq.${userId},addressee_id.eq.${user.id})`)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "blocked" })
      .eq("id", existing.id);
    return error ? { success: false, error: error.message } : { success: true };
  } else {
    const { error } = await supabase
      .from("friendships")
      .insert({
        requester_id: user.id,
        addressee_id: userId,
        status: "blocked"
      });
    return error ? { success: false, error: error.message } : { success: true };
  }
}

export async function getFriends(userId) {
  const { data, error } = await supabase.rpc("get_friends", { p_user_id: userId });
  
  if (error) return { success: false, error: error.message };
  
  // Enrich with progression data for D&D theme
  if (data && data.length > 0) {
    const friendIds = data.map(f => f.friend_id);
    const { data: progressions } = await supabase
      .from("user_progression")
      .select("user_id, level, title")
      .in("user_id", friendIds);
    
    const progressMap = new Map(progressions?.map(p => [p.user_id, p]) || []);
    
    return {
      success: true,
      data: data.map(friend => ({
        ...friend,
        level: progressMap.get(friend.friend_id)?.level || 1,
        title: progressMap.get(friend.friend_id)?.title || 'Wanderer',
      }))
    };
  }
  
  return { success: true, data: data || [] };
}

export async function getPendingRequests(userId) {
  const { data, error } = await supabase.rpc("get_pending_requests", { p_user_id: userId });
  return error ? { success: false, error: error.message } : { success: true, data: data || [] };
}

export async function searchUsers(query) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // Search by email or display_name
  const { data, error } = await supabase
    .from("user_profiles")
    .select("user_id, display_name, avatar_url, email:user_id")
    .or(`display_name.ilike.%${query}%`)
    .neq("user_id", user.id)
    .limit(20);

  if (error) return { success: false, error: error.message };

  // Enrich with D&D progression data
  if (data && data.length > 0) {
    const userIds = data.map(u => u.user_id);
    const { data: progressions } = await supabase
      .from("user_progression")
      .select("user_id, level, title")
      .in("user_id", userIds);
    
    const progressMap = new Map(progressions?.map(p => [p.user_id, p]) || []);
    
    return {
      success: true,
      data: data.map(profile => ({
        ...profile,
        level: progressMap.get(profile.user_id)?.level || 1,
        title: progressMap.get(profile.user_id)?.title || 'Wanderer',
      }))
    };
  }

  return { success: true, data: data || [] };
}

export async function getFriendshipStatus(userId, otherUserId) {
  const { data, error } = await supabase
    .from("friendships")
    .select("id, status, requester_id, addressee_id")
    .or(`and(requester_id.eq.${userId},addressee_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},addressee_id.eq.${userId})`)
    .single();

  if (error && error.code !== "PGRST116") {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

// ============================================
// Conversation Management
// ============================================

export async function getConversations(userId) {
  const { data, error } = await supabase
    .from("conversation_participants")
    .select(`
      conversation_id,
      last_read_at,
      conversations (
        id,
        type,
        name,
        avatar_url,
        last_message_at,
        created_at
      )
    `)
    .eq("user_id", userId)
    .order("conversations(last_message_at)", { ascending: false });

  if (error) return { success: false, error: error.message };

  // Also include global conversation
  const { data: globalConv } = await supabase
    .from("conversations")
    .select("*")
    .eq("type", "global")
    .single();

  const conversations = data?.map(d => ({
    ...d.conversations,
    last_read_at: d.last_read_at
  })) || [];

  if (globalConv && !conversations.find(c => c.id === globalConv.id)) {
    conversations.unshift(globalConv);
  }

  return { success: true, data: conversations };
}

export async function getConversation(conversationId) {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      conversation_participants (
        user_id,
        role,
        joined_at
      )
    `)
    .eq("id", conversationId)
    .single();

  return error ? { success: false, error: error.message } : { success: true, data };
}

export async function createDirectConversation(participantId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data, error } = await supabase.rpc("get_or_create_direct_conversation", {
    p_user1_id: user.id,
    p_user2_id: participantId
  });

  return error ? { success: false, error: error.message } : { success: true, data };
}

export async function createGroupConversation(name, participantIds) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // Create conversation
  const { data: conversation, error: convError } = await supabase
    .from("conversations")
    .insert({
      type: "group",
      name,
      created_by: user.id
    })
    .select()
    .single();

  if (convError) return { success: false, error: convError.message };

  // Add participants (including creator)
  const participants = [user.id, ...participantIds].map(uid => ({
    conversation_id: conversation.id,
    user_id: uid,
    role: uid === user.id ? "admin" : "member"
  }));

  const { error: partError } = await supabase
    .from("conversation_participants")
    .insert(participants);

  if (partError) return { success: false, error: partError.message };

  return { success: true, data: conversation };
}

// ============================================
// Messaging
// ============================================

export async function getMessages(conversationId, limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select(`
      *,
      sender:sender_id (
        id,
        email
      )
    `)
    .eq("conversation_id", conversationId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  return error ? { success: false, error: error.message } : { success: true, data: data || [] };
}

export async function sendMessage(conversationId, content) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content
    })
    .select()
    .single();

  return error ? { success: false, error: error.message } : { success: true, data };
}

export async function editMessage(messageId, newContent) {
  const { data, error } = await supabase
    .from("chat_messages")
    .update({ content: newContent, edited_at: new Date().toISOString() })
    .eq("id", messageId)
    .select()
    .single();

  return error ? { success: false, error: error.message } : { success: true, data };
}

export async function deleteMessage(messageId) {
  const { error } = await supabase
    .from("chat_messages")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", messageId);

  return error ? { success: false, error: error.message } : { success: true };
}

export async function markConversationAsRead(conversationId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("conversation_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id);

  return error ? { success: false, error: error.message } : { success: true };
}

export async function getUnreadCount(userId) {
  const { data, error } = await supabase
    .from("conversation_participants")
    .select(`
      conversation_id,
      last_read_at,
      conversations!inner (
        last_message_at
      )
    `)
    .eq("user_id", userId);

  if (error) return { success: false, error: error.message };

  let unreadCount = 0;
  data?.forEach(cp => {
    if (cp.conversations?.last_message_at) {
      const lastMessage = new Date(cp.conversations.last_message_at);
      const lastRead = cp.last_read_at ? new Date(cp.last_read_at) : new Date(0);
      if (lastMessage > lastRead) unreadCount++;
    }
  });

  return { success: true, data: unreadCount };
}

// ============================================
// Real-time Subscriptions
// ============================================

export function subscribeToConversation(conversationId, onMessage) {
  const channel = supabase
    .channel(`conversation:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => onMessage(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

export function subscribeToFriendRequests(userId, onRequest) {
  const channel = supabase
    .channel(`friend_requests:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "friendships",
        filter: `addressee_id=eq.${userId}`
      },
      (payload) => onRequest(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

export function subscribeToConversationList(userId, onChange) {
  const channel = supabase
    .channel(`conversations:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "conversations"
      },
      (payload) => onChange(payload)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

// ============================================
// Online Status
// ============================================

export async function updateOnlineStatus(status) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("user_profiles")
    .update({
      online_status: status,
      last_seen_at: new Date().toISOString()
    })
    .eq("user_id", user.id);

  return error ? { success: false, error: error.message } : { success: true };
}

// ============================================
// Constants
// ============================================

export { GLOBAL_CONVERSATION_ID };

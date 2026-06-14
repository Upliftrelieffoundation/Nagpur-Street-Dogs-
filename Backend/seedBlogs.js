import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import Blog from './Schemas/BlogSchema.js';
import User from './Schemas/UserSchema.js';

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

const blogPosts = [
  {
    title: "Understanding Indian Pariah Dogs: India's Native Breed",
    description: "Discover the amazing Indian Pariah dog — one of the oldest and most resilient breeds on the planet.",
    tags: ["Dog Breeds"],
    content: [
      { type: 'heading', data: { text: 'The Indian Pariah Dog — A Breed Built by Nature' } },
      { type: 'paragraph', data: { text: 'The Indian Pariah dog, also known as the INDog, is one of the oldest and most natural dog breeds in the world. Unlike designer breeds, Pariahs have evolved naturally over thousands of years, making them incredibly resilient, intelligent, and healthy.' } },
      { type: 'paragraph', data: { text: 'These medium-sized dogs typically weigh between 15-25 kg and stand 35-45 cm tall. Their short coats come in various colors — from brown and black to white and piebald patterns. Their most distinctive feature is their pointed, erect ears and curled tails.' } },
      { type: 'heading', data: { text: 'Why Pariahs Make Amazing Pets' } },
      { type: 'paragraph', data: { text: 'Pariah dogs are incredibly loyal, smart, and adaptable. They have strong immune systems, rarely suffer from genetic diseases, and are excellent with children. Their street-smart nature makes them highly trainable and perceptive to their owner\'s emotions.' } },
    ],
    banner: 'https://images.unsplash.com/photo-1583337130417-13104dec14a3?w=800&h=500&fit=crop',
  },
  {
    title: "Essential Dog Training Tips for First-Time Owners",
    description: "Start your training journey right with these proven methods every new dog owner needs.",
    tags: ["Dog Training"],
    content: [
      { type: 'heading', data: { text: 'Building Trust Before Commands' } },
      { type: 'paragraph', data: { text: 'Training isn\'t about dominance — it\'s about building a bond of trust. Before teaching any command, spend the first few weeks letting your rescue dog feel safe and comfortable in their new home.' } },
      { type: 'paragraph', data: { text: 'Start with basic commands like "sit," "stay," and "come." Use positive reinforcement — treats, praise, and play — rather than punishment. Sessions should be short (5-10 minutes) and consistent, at least twice daily.' } },
      { type: 'heading', data: { text: 'Socialization is Key' } },
      { type: 'paragraph', data: { text: 'Expose your dog to different environments, people, and other animals gradually. A well-socialized dog is confident and calm, while an isolated dog may develop fear-based behaviors.' } },
    ],
    banner: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=500&fit=crop',
  },
  {
    title: "Street Dog Nutrition: Feeding Strays the Right Way",
    description: "Learn what to feed community dogs for optimal health and nutrition.",
    tags: ["Dog Health & Nutrition"],
    content: [
      { type: 'heading', data: { text: 'What to Feed Street Dogs' } },
      { type: 'paragraph', data: { text: 'Street dogs need balanced nutrition to stay healthy. Cooked rice mixed with chicken, eggs, and vegetables provides a balanced diet. Avoid spicy, oily, or salty human food — it can cause severe digestive issues.' } },
      { type: 'paragraph', data: { text: 'Always provide fresh, clean water alongside food. In Nagpur\'s extreme summer heat, water is even more critical than food. Many dehydration-related deaths can be prevented with simple water pots placed around your area.' } },
      { type: 'heading', data: { text: 'Foods to Avoid' } },
      { type: 'paragraph', data: { text: 'Never feed dogs chocolate, onions, garlic, grapes, raisins, or anything with artificial sweeteners like xylitol. These are toxic and can be fatal. Also avoid bones — especially cooked chicken bones, which can splinter and cause internal damage.' } },
    ],
    banner: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800&h=500&fit=crop',
  },
  {
    title: "Why Regular Grooming Matters for Street Dogs",
    description: "Keep your community dogs healthy and happy with proper grooming practices.",
    tags: ["Dog Grooming"],
    content: [
      { type: 'heading', data: { text: 'The Hidden Health Benefit of Grooming' } },
      { type: 'paragraph', data: { text: 'Grooming isn\'t just about looks — it\'s a critical health check opportunity. Regular brushing removes parasites, lets you spot wounds early, and keeps the coat clean and insulated. For street dogs, a bath with mild anti-flea shampoo every 2-3 weeks can prevent tick infestations.' } },
      { type: 'heading', data: { text: 'Simple Grooming Routine for Community Dogs' } },
      { type: 'paragraph', data: { text: 'Start by gently brushing the coat to remove tangles and debris. Check ears for mites or infections — a clean cotton ball wipe weekly works. Trim overgrown nails if possible (street dogs often develop painful curled nails from walking on concrete).' } },
    ],
    banner: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&h=500&fit=crop',
  },
  {
    title: "Understanding Dog Body Language: What Your Dog is Telling You",
    description: "Decode tail wags, ear positions, and postures to better understand your dog.",
    tags: ["Dog Behavior"],
    content: [
      { type: 'heading', data: { text: 'The Language of Tails' } },
      { type: 'paragraph', data: { text: 'A wagging tail doesn\'t always mean happiness. A high, stiff wag signals alertness or potential aggression. A low, loose wag indicates a relaxed, friendly dog. A tucked tail between the legs signals fear or submission — common in newly rescued street dogs.' } },
      { type: 'heading', data: { text: 'Reading Ears and Eyes' } },
      { type: 'paragraph', data: { text: 'Ears pinned flat against the head often signal anxiety or fear. Relaxed, natural ear position means comfort. Avoid prolonged direct eye contact with unfamiliar street dogs — they may perceive it as a threat. A soft, squinting "smile" is a sign of trust.' } },
    ],
    banner: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&h=500&fit=crop',
  },
  {
    title: "How to Prepare for a Successful Dog Adoption",
    description: "Everything you need to know before bringing a rescued dog into your home.",
    tags: ["Dog Adoption & Rescue"],
    content: [
      { type: 'heading', data: { text: 'Before You Adopt' } },
      { type: 'paragraph', data: { text: 'Adopting a street dog is one of the most rewarding experiences, but it requires preparation. Ensure your home is safe — remove toxic plants, secure electrical wires, and create a quiet space where the dog can retreat.' } },
      { type: 'paragraph', data: { text: 'Stock up on essentials: food bowls, a comfortable bed, quality dog food, a collar with ID tags, and a leash. Schedule a vet visit within the first week for a full health checkup, vaccinations, and deworming.' } },
      { type: 'heading', data: { text: 'The First Week Home' } },
      { type: 'paragraph', data: { text: 'Expect an adjustment period. Your new rescue may be shy, anxious, or overly excited. Give them space, maintain a consistent routine, and don\'t overwhelm them with too many visitors in the first few days. Patience and love are the best tools.' } },
    ],
    banner: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=500&fit=crop',
  },
  {
    title: "Training Service Dogs: From Streets to Service",
    description: "How rescued dogs can be trained for service and therapy work.",
    tags: ["Service Dogs"],
    content: [
      { type: 'heading', data: { text: 'The Power of Rescue Dogs in Service' } },
      { type: 'paragraph', data: { text: 'Contrary to popular belief, many of the best service dogs come from rescue backgrounds. Their natural resilience, adaptability, and desire to please make them exceptional candidates for service work — from therapy animals to guide dogs for the visually impaired.' } },
      { type: 'heading', data: { text: 'Core Traits of a Service Dog' } },
      { type: 'paragraph', data: { text: 'A good service dog must be calm under pressure, responsive to commands, non-reactive to distractions, and genuinely enjoy being close to humans. The training process typically takes 12-24 months and covers basic obedience, task-specific skills, and public access behavior.' } },
    ],
    banner: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=500&fit=crop',
  },
  {
    title: "Fun Dog Sports and Activities for Active Owners",
    description: "Keep your dog physically and mentally stimulated with these engaging activities.",
    tags: ["Dog Sports & Activities"],
    content: [
      { type: 'heading', data: { text: 'Why Dog Sports Matter' } },
      { type: 'paragraph', data: { text: 'Dogs are naturally active animals. Without proper exercise, they can develop behavioral issues like chewing, excessive barking, or aggression. Dog sports provide physical exercise, mental stimulation, and strengthen the human-animal bond.' } },
      { type: 'paragraph', data: { text: 'Popular activities include agility courses, fetch competitions, flyball, and even dog yoga ("Doga"). Even simple activities like long walks, swimming, or playing tug-of-war at home can keep your dog healthy and happy.' } },
    ],
    banner: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=500&fit=crop',
  },
  {
    title: "Essential Dog Products Every Rescue Owner Needs",
    description: "A curated guide to the best products for newly adopted rescue dogs.",
    tags: ["Dog Products & Gear"],
    content: [
      { type: 'heading', data: { text: 'Must-Have Gear for New Rescue Owners' } },
      { type: 'paragraph', data: { text: 'When adopting a street dog, having the right products makes the transition smoother. Start with a sturdy harness (not a collar) — rescues often have sensitive necks. A reflective leash is essential for evening walks.' } },
      { type: 'paragraph', data: { text: 'Invest in an orthopedic dog bed for joint support, a slow-feeder bowl to prevent bloating, and a set of durable chew toys. For Nagpur\'s climate, a cooling mat during summer and a warm blanket during winter are invaluable.' } },
    ],
    banner: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800&h=500&fit=crop',
  },
  {
    title: "Puppy Care 101: Raising a Rescued Puppy",
    description: "Special considerations when your rescue is a young puppy.",
    tags: ["Puppy Care"],
    content: [
      { type: 'heading', data: { text: 'The Critical First Weeks' } },
      { type: 'paragraph', data: { text: 'Rescued puppies need extra care, especially if they\'ve been separated from their mother. Feed them warm milk (not cow\'s milk — use pet-formulated milk replacer) every 3-4 hours for the first few weeks.' } },
      { type: 'paragraph', data: { text: 'Begin vaccinations at 6-8 weeks of age, following your vet\'s schedule. Puppies are vulnerable to diseases like parvovirus and distemper, so avoid public areas until fully vaccinated. Socialize them gently with calm, vaccinated dogs once cleared by the vet.' } },
    ],
    banner: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=500&fit=crop',
  },
  {
    title: "Caring for Senior Rescue Dogs: Love in Their Golden Years",
    description: "Special care and attention older rescue dogs need to thrive.",
    tags: ["Senior Dog Care"],
    content: [
      { type: 'heading', data: { text: 'Why Senior Rescues Deserve Special Attention' } },
      { type: 'paragraph', data: { text: 'Older dogs are often overlooked in rescue situations, but they make wonderful companions. They\'re calmer, already house-trained, and deeply grateful for a second chance at love. Senior dogs (7+ years) do require some special care adjustments.' } },
      { type: 'heading', data: { text: 'Health and Comfort Adjustments' } },
      { type: 'paragraph', data: { text: 'Provide orthopedic bedding for achy joints. Switch to senior-formulated food that\'s easier to digest and supports joint health. Shorter, more frequent walks work better than long sessions. Regular vet checkups every 6 months are essential to catch age-related issues early.' } },
    ],
    banner: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&h=500&fit=crop',
  },
  {
    title: "Dog-Friendly Places to Visit Around Maharashtra",
    description: "Discover the best pet-friendly destinations for memorable adventures.",
    tags: ["Dog-Friendly Travel"],
    content: [
      { type: 'heading', data: { text: 'Exploring Maharashtra with Your Dog' } },
      { type: 'paragraph', data: { text: 'Maharashtra offers many dog-friendly destinations for weekend getaways. Lonavala and Khandala are popular — most resorts welcome pets, and the lush hills are perfect for hiking with your furry friend.' } },
      { type: 'paragraph', data: { text: 'Mahabaleshwar, Igatpuri, and Alibaug also offer pet-friendly accommodations. Always carry your dog\'s vaccination records, keep them on a leash in public areas, and clean up after them. Travel during cooler hours (early morning or late evening) to avoid heat stress, especially for brachycephalic breeds.' } },
    ],
    banner: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&h=500&fit=crop',
  },
];

async function seedBlogs() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('MongoDB Connected');

    // Find or create a default user for blog authorship
    let user = await User.findOne();
    if (!user) {
      console.log('No user found. Please create a user first, or blogs won\'t have an author.');
      await mongoose.disconnect();
      return;
    }

    console.log(`Using user: ${user.email} as blog author`);

    for (const post of blogPosts) {
      const existing = await Blog.findOne({ title: post.title });
      if (existing) {
        console.log(`Skipping "${post.title}" — already exists`);
        continue;
      }

      const blog = new Blog({
        blog_id: nanoid(),
        title: post.title,
        description: post.description,
        banner: post.banner,
        content: post.content,
        tags: post.tags,
        author: user._id,
        draft: false,
        activity: {
          total_likes: Math.floor(Math.random() * 100),
          total_comments: Math.floor(Math.random() * 30),
          total_reads: Math.floor(Math.random() * 500) + 50,
          total_parent_comments: Math.floor(Math.random() * 10),
        },
      });

      await blog.save();

      // Add blog to user's blogs array
      user.blogs.push(blog._id);
      await user.save();

      console.log(`✓ Created: "${post.title}" [${post.tags.join(', ')}]`);
    }

    console.log('\nSeeding complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding blogs:', error);
    process.exit(1);
  }
}

seedBlogs();

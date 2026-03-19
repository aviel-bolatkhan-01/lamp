// True/False Question Bank
// Format: { q: "Question text", a: boolean (true/false), e: "Explanation/Reference" }

const TF_Q = [
  // Genesis
  {q:"God created the world in 6 days and rested on the 7th.", a:true, e:"Genesis 2:2"},
  {q:"Adam was created from dust.", a:true, e:"Genesis 2:7"},
  {q:"Eve was created from Adam's foot.", a:false, e:"Genesis 2:21-22 (Rib)"},
  {q:"Cain killed his brother Abel.", a:true, e:"Genesis 4:8"},
  {q:"Methuselah is the oldest man in the Bible.", a:true, e:"Genesis 5:27 (969 years)"},
  {q:"Noah built the Ark alone.", a:false, e:"Genesis 6 (His sons helped)"},
  {q:"It rained for 40 days and 40 nights during the flood.", a:true, e:"Genesis 7:12"},
  {q:"The rainbow is a sign of God's promise never to flood the earth again.", a:true, e:"Genesis 9:13"},
  {q:"Abraham was originally named Abram.", a:true, e:"Genesis 17:5"},
  {q:"Sarah was 90 years old when Isaac was born.", a:true, e:"Genesis 17:17"},
  {q:"Lot's wife turned into a pillar of gold.", a:false, e:"Genesis 19:26 (Salt)"},
  {q:"Jacob had a twin brother named Esau.", a:true, e:"Genesis 25:24-26"},
  {q:"Joseph had a coat of many colors.", a:true, e:"Genesis 37:3"},
  {q:"Joseph's brothers sold him to the Egyptians directly.", a:false, e:"Genesis 37:28 (Ishmaelites/Midianites)"},
  {q:"Pharaoh had a dream about 7 fat cows and 7 skinny cows.", a:true, e:"Genesis 41:1-4"},

  // Exodus
  {q:"Moses was placed in a basket in the Nile river.", a:true, e:"Exodus 2:3"},
  {q:"Moses killed an Egyptian.", a:true, e:"Exodus 2:12"},
  {q:"God spoke to Moses through a burning bush.", a:true, e:"Exodus 3:2"},
  {q:"Aaron was Moses' brother.", a:true, e:"Exodus 4:14"},
  {q:"There were 12 plagues in Egypt.", a:false, e:"Exodus 7-12 (10 plagues)"},
  {q:"The Israelites crossed the Red Sea on dry land.", a:true, e:"Exodus 14:22"},
  {q:"Moses received the Ten Commandments on Mount Sinai.", a:true, e:"Exodus 19-20"},
  {q:"The Golden Calf was made by Aaron.", a:true, e:"Exodus 32:4"},

  // Historical Books
  {q:"Joshua led the Israelites into the Promised Land.", a:true, e:"Joshua 1"},
  {q:"Rahab hid two spies in Jericho.", a:true, e:"Joshua 2"},
  {q:"The walls of Jericho fell after the Israelites shouted.", a:true, e:"Joshua 6:20"},
  {q:"Samson was a judge of Israel.", a:true, e:"Judges 13-16"},
  {q:"Delilah cut Samson's hair.", a:false, e:"Judges 16:19 (A man cut it)"},
  {q:"Ruth was a Moabite.", a:true, e:"Ruth 1:4"},
  {q:"Samuel was the last judge of Israel.", a:true, e:"1 Samuel 7:15"},
  {q:"Saul was the first king of Israel.", a:true, e:"1 Samuel 10:1"},
  {q:"David killed Goliath with a sword.", a:false, e:"1 Samuel 17:50 (Sling and stone)"},
  {q:"David was a shepherd before becoming king.", a:true, e:"1 Samuel 16:11"},
  {q:"Solomon was known for his wisdom.", a:true, e:"1 Kings 3"},
  {q:"Solomon built the first temple.", a:true, e:"1 Kings 6"},
  {q:"Elijah was taken to heaven in a whirlwind.", a:true, e:"2 Kings 2:11"},
  {q:"Esther was a queen of Persia.", a:true, e:"Esther 2:17"},
  {q:"Job lost everything but remained faithful to God.", a:true, e:"Job 1-2"},

  // Psalms & Proverbs
  {q:"David wrote all the Psalms.", a:false, e:"Psalms (Various authors)"},
  {q:"The Lord is my Shepherd is from Psalm 23.", a:true, e:"Psalm 23:1"},
  {q:"Proverbs was written primarily by Solomon.", a:true, e:"Proverbs 1:1"},

  // Prophets
  {q:"Isaiah prophesied the birth of Jesus.", a:true, e:"Isaiah 7:14, 9:6"},
  {q:"Jeremiah is known as the weeping prophet.", a:true, e:"Jeremiah 9:1"},
  {q:"Daniel was thrown into a den of lions.", a:true, e:"Daniel 6"},
  {q:"Shadrach, Meshach, and Abednego were thrown into a fiery furnace.", a:true, e:"Daniel 3"},
  {q:"Jonah was swallowed by a whale.", a:true, e:"Jonah 1:17 (Great fish)"}, // Common phrasing usually accepted as true in trivia
  
  // Gospels
  {q:"Jesus was born in Nazareth.", a:false, e:"Luke 2:4-7 (Bethlehem)"},
  {q:"There were three wise men.", a:false, e:"Matthew 2 (Bible doesn't say number, just 3 gifts)"},
  {q:"Jesus was baptized by John the Baptist.", a:true, e:"Matthew 3:13"},
  {q:"Jesus fasted for 40 days.", a:true, e:"Matthew 4:2"},
  {q:"Jesus turned water into wine at a wedding in Cana.", a:true, e:"John 2"},
  {q:"Peter walked on water.", a:true, e:"Matthew 14:29"},
  {q:"Jesus fed 5000 people with 5 loaves and 2 fish.", a:true, e:"Matthew 14:17-21"},
  {q:"Lazarus was dead for 4 days before Jesus raised him.", a:true, e:"John 11:39"},
  {q:"Judas Iscariot betrayed Jesus for 30 pieces of silver.", a:true, e:"Matthew 26:15"},
  {q:"Peter denied Jesus three times.", a:true, e:"Matthew 26:75"},
  {q:"Jesus was crucified at Golgotha.", a:true, e:"Matthew 27:33"},
  {q:"Jesus rose on the third day.", a:true, e:"1 Corinthians 15:4"},

  // Acts & Epistles
  {q:"The Holy Spirit came at Pentecost.", a:true, e:"Acts 2"},
  {q:"Paul was originally named Saul.", a:true, e:"Acts 13:9"},
  {q:"Stephen was the first Christian martyr.", a:true, e:"Acts 7:60"},
  {q:"Paul wrote the book of Romans.", a:true, e:"Romans 1:1"},
  {q:"The fruits of the Spirit are 9.", a:true, e:"Galatians 5:22-23"},
  {q:"Revelation is the last book of the Bible.", a:true, e:"Revelation 22:21"},
  {q:"John wrote Revelation on the island of Patmos.", a:true, e:"Revelation 1:9"}
];

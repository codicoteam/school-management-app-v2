import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Book, BookOpen, Clock, Star, Download, 
  Filter, Bookmark, ExternalLink, Library as LibraryIcon, 
  History, Info
} from "lucide-react";
import { motion } from "framer-motion";

const categories = ["All", "Science", "Mathematics", "Literature", "History", "Geography", "Technology"];

const libraryBooks = [
  {
    id: 1,
    title: "Advanced Mathematics",
    author: "Richard G. Brown",
    category: "Mathematics",
    type: "textbook",
    status: "Available",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=200",
    description: "A comprehensive guide to calculus and trigonometry.",
    year: "2023",
    isDigital: true
  },
  {
    id: 2,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Literature",
    type: "novel",
    status: "Borrowed",
    dueDate: "2024-06-25",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200",
    description: "A classic novel exploring themes of wealth and social status.",
    year: "1925",
    isDigital: false
  },
  {
    id: 3,
    title: "World History: Perspectives",
    author: "Elisabeth Gaynor Ellis",
    category: "History",
    type: "textbook",
    status: "Available",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=200",
    description: "An overview of global history from ancient civilizations to the modern era.",
    year: "2021",
    isDigital: true
  },
  {
    id: 4,
    title: "Quantum Physics for Beginners",
    author: "Jason Stephenson",
    category: "Science",
    type: "textbook",
    status: "Available",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=200",
    description: "Making the complex world of quantum mechanics easy to understand.",
    year: "2022",
    isDigital: true
  },
  {
    id: 5,
    title: "Digital Marketing Essentials",
    author: "Dave Chaffey",
    category: "Technology",
    type: "textbook",
    status: "Available",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200",
    description: "Modern strategies for online business and marketing.",
    year: "2024",
    isDigital: true
  },
  {
    id: 6,
    title: "Physical Geography",
    author: "Robert E. Gabler",
    category: "Geography",
    type: "textbook",
    status: "Reserved",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&q=80&w=200",
    description: "Understanding the physical processes that shape our world.",
    year: "2022",
    isDigital: false
  },
  {
    id: 7,
    title: "Modern Economics",
    author: "Paul Samuelson",
    category: "Social Studies",
    type: "textbook",
    status: "Available",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1611095771243-16a3df54274c?auto=format&fit=crop&q=80&w=200",
    description: "Core principles of micro and macroeconomics.",
    year: "2023",
    isDigital: true
  },
  {
    id: 8,
    title: "Biology: Life on Earth",
    author: "Teresa Audesirk",
    category: "Science",
    type: "textbook",
    status: "Available",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1532187863486-abf51ad05b86?auto=format&fit=crop&q=80&w=200",
    description: "Exploring the biological systems that sustain life.",
    year: "2022",
    isDigital: true
  }
];

const LibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const getFilteredBooks = (type?: string) => {
    return libraryBooks.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
      const matchesType = !type || (type === "ebooks" ? book.isDigital : type === "textbooks" ? book.type === "textbook" : true);
      return matchesSearch && matchesCategory && matchesType;
    });
  };

  const renderBookGrid = (books: typeof libraryBooks) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {books.map((book) => (
        <motion.div
          key={book.id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <div className="relative h-48 w-full bg-muted overflow-hidden">
              <img 
                src={book.image} 
                alt={book.title} 
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <Badge 
                  variant={book.status === "Available" ? "default" : book.status === "Borrowed" ? "destructive" : "outline"}
                  className="shadow-sm backdrop-blur-md bg-opacity-80 border-none"
                >
                  {book.status}
                </Badge>
              </div>
              <div className="absolute bottom-2 left-2 flex gap-1">
                <Badge variant="secondary" className="bg-black/60 text-white border-none backdrop-blur-sm">
                  {book.category}
                </Badge>
                {book.type === "textbook" && (
                  <Badge variant="secondary" className="bg-primary/80 text-white border-none backdrop-blur-sm">
                    Textbook
                  </Badge>
                )}
              </div>
            </div>
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base font-bold line-clamp-1 group-hover:text-primary transition-colors">
                    {book.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">by {book.author}</p>
                </div>
                <div className="flex items-center text-amber-500 font-bold text-xs bg-amber-500/10 px-1.5 py-0.5 rounded">
                  <Star className="h-3 w-3 fill-amber-500 mr-1" />
                  {book.rating}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex-1 flex flex-col">
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed italic">
                "{book.description}"
              </p>
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div className="flex gap-2">
                  {book.isDigital ? (
                    <Button size="sm" className="h-8 text-xs font-semibold bg-green-600 hover:bg-green-700">
                      <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Read Online
                    </Button>
                  ) : book.status === "Available" ? (
                    <Button size="sm" className="h-8 text-xs font-semibold">
                      <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Borrow
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="h-8 text-xs font-semibold" disabled>
                      <Clock className="h-3.5 w-3.5 mr-1.5" /> Waitlist
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Button size="sm" variant="ghost" className="h-8 text-xs text-primary font-medium p-0 hover:bg-transparent">
                  Details <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground flex items-center gap-2">
            <LibraryIcon className="h-8 w-8 text-primary" />
            School Library
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Access your textbooks, physical books, and research journals.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" /> Borrowing History
          </Button>
          <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
            <Bookmark className="h-4 w-4 mr-2" /> My Bookmarks
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Sidebar Filters */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-sm bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" /> Subjects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === cat 
                    ? "bg-primary text-primary-foreground font-medium" 
                    : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-accent/5 overflow-hidden">
            <CardHeader className="pb-3 bg-accent/10">
              <CardTitle className="text-sm font-medium text-accent flex items-center gap-2">
                <Info className="h-4 w-4" /> Digital Access
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Most textbooks are now available as digital copies. Look for the "Read Online" badge.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search textbooks, authors, or ISBN..." 
              className="pl-10 h-12 shadow-sm border-none bg-background focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="textbooks" className="w-full">
            <TabsList className="bg-muted w-full justify-start p-1 h-11">
              <TabsTrigger value="textbooks" className="px-6">Text Books</TabsTrigger>
              <TabsTrigger value="all-books" className="px-6">All Resources</TabsTrigger>
              <TabsTrigger value="ebooks" className="px-6">Digital Library</TabsTrigger>
              <TabsTrigger value="physical" className="px-6">Physical Only</TabsTrigger>
            </TabsList>

            <TabsContent value="textbooks" className="mt-6">
              {renderBookGrid(getFilteredBooks("textbooks"))}
              {getFilteredBooks("textbooks").length === 0 && (
                <div className="text-center py-20 bg-muted/20 rounded-xl">
                  <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-medium text-foreground">No textbooks found</h3>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all-books" className="mt-6">
              {renderBookGrid(getFilteredBooks())}
            </TabsContent>

            <TabsContent value="ebooks" className="mt-6">
              {renderBookGrid(getFilteredBooks("ebooks"))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};


export default LibraryPage;

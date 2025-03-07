import Link from "next/link"
import { CalendarIcon, FileTextIcon, RocketIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for blog posts
const blogPosts = []

// Sample data for whitepapers
const whitepapers = []

// Sample data for upcoming projects
const upcomingProjects = [
  {
    id: 1,
    title: "ThinkTact for Education",
    description:
      "Adapting our platform for educational contexts to help students develop critical thinking and argumentation skills.",
    status: "In Development",
  },
  {
    id: 2,
    title: "Argument Visualization Tools",
    description:
      "New visualization features to help users better understand the structure and flow of complex arguments.",
    status: "Planning Phase",
  },
]

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none gradient-text">
                Resources
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Explore our latest blog posts, whitepapers, and upcoming projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="blog" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Blog Posts
              </TabsTrigger>
              <TabsTrigger value="whitepapers" className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4" />
                Whitepapers
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <RocketIcon className="h-4 w-4" />
                Upcoming Projects
              </TabsTrigger>
            </TabsList>

            {/* Blog Posts Tab */}
            <TabsContent value="blog" className="space-y-8">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-xl font-medium mb-4">Coming Soon</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-[600px]">
                  We're working on creating valuable content to help you master the art of logical reasoning and argumentation. 
                  Check back soon for insightful articles and guides.
                </p>
              </div>
            </TabsContent>

            {/* Whitepapers Tab */}
            <TabsContent value="whitepapers" className="space-y-8">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-xl font-medium mb-4">Whitepapers Coming Soon</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-[600px]">
                  Our team is preparing in-depth whitepapers on AI-driven argument analysis and critical thinking. 
                  Stay tuned for comprehensive technical resources.
                </p>
              </div>
            </TabsContent>

            {/* Upcoming Projects Tab */}
            <TabsContent value="projects" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {upcomingProjects.map((project) => (
                  <div key={project.id} className="flex flex-col border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-gray-800 dark:text-port-300">
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4 flex-1">{project.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Stay Updated</h2>
              <p className="mx-auto max-w-[500px] text-gray-500 dark:text-gray-400">
                Subscribe to our newsletter to receive updates on new resources and upcoming features.
              </p>
            </div>
            <div className="w-full max-w-md flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


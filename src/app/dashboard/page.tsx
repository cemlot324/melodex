'use server'

import { auth } from "@clerk/nextjs";
import Image from "next/image"
import Link from "next/link"
import { Music, Search, ListPlus, Clock, Star, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { prisma } from "@/lib/prisma"

export default async function Dashboard() {
  const { userId } = auth();
  
  if (!userId) {
    return <div>Not authenticated</div>;
  }

  const totalSongs = await prisma.song.count({
    where: { userId }
  })
  
  const totalHours = await prisma.listen.aggregate({
    where: { userId },
    _sum: { duration: true }
  })
  
  const averageRating = await prisma.rating.aggregate({
    where: { userId },
    _avg: { value: true }
  })
  
  const recentlyAdded = await prisma.song.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 4,
    include: { ratings: true }
  })
  
  const topRated = await prisma.song.findMany({
    where: { userId },
    include: {
      ratings: {
        where: { userId }
      }
    },
    orderBy: {
      ratings: {
        _avg: {
          value: 'desc'
        }
      }
    },
    take: 3
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Songs Logged</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSongs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours Listened</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours._sum.duration / 3600}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating._avg.value}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recently Added</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              <div className="space-y-4">
                {recentlyAdded.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <Image
                      src={item.coverImage}
                      alt={`${item.title} cover`}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                    <div>
                      <p className="text-sm font-medium leading-none">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Rated</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              <div className="space-y-4">
                {topRated.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <Image
                      src={item.coverImage}
                      alt={`${item.title} cover`}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.artist}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm font-medium">{item.ratings[0].value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Song/Album
        </Button>
        <Button variant="outline">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
        <Button variant="outline">
          <ListPlus className="mr-2 h-4 w-4" /> View Wishlist
        </Button>
      </div>
    </div>
  )
}
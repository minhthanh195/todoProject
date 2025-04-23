// import { NextResponse } from "next/server";

// let todos: any[] = [];

// export async function GET() {
//     return NextResponse.json(todos);
// }

// export async function POST(req: Request) {
//     const newTodo = await req.json();
//     todos.unshift(newTodo);

//     return NextResponse.json({
//         updated: newTodo,
//         currentValue: todos,
//     });
// }

// export async function DELETE(req: Request) {
//     const { id } = await req.json();
//     todos = todos.filter((t) => t.id !== id)
//     return NextResponse.json({success : true});
// }

// export async function PUT(req: Request) {
//     const updatedTodo = await req.json();
//     todos = [updatedTodo]

//     return NextResponse.json({
//         success: true,
//         updated: updatedTodo,
//         currentValue: todos
//     });
// }
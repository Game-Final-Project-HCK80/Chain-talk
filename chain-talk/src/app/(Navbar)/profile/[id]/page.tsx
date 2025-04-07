// import { UserType } from "@/types";


// type Props = {
//     params: {
//         id: number;
//     };
// };

// export default async function UserDetail({ params }: Props) {
//     const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `api/profile/${params.id}`);
//     if (!response.ok) {
//         throw new Error(`Response status: ${response.status}`);
//     }

//     const user: UserType = await response.json();
//     console.log(user, "User Detail");

//     return (
//         <div>
//             <h1 className="text-center text-4xl mb-10 font-semibold">User Detail</h1>
//             <div className="overflow-x-auto mb-30">
//                 <table className="table table-zebra">
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Description</th>
//                             <th>Reward</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td>{user?.picture}</td>
//                             <td>{user?.username}</td>
//                             <td>{user?.point}</td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

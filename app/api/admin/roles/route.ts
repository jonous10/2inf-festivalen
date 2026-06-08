import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import {
  getAllRoles,
  getAllPermissions,
  getRoleWithPermissions,
  createRole,
  updateRole,
  deleteRole,
  hasPermission,
  logAuditAction,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const canManage = await hasPermission(session.userId, "manage_roles");
    if (!canManage) {
      return NextResponse.json(
        { error: "You do not have permission to manage roles" },
        { status: 403 },
      );
    }

    const roles = await getAllRoles();
    const permissions = await getAllPermissions();

    // Get detailed role information
    const rolesWithPermissions = await Promise.all(
      roles.map(async (role) => {
        const detailed = await getRoleWithPermissions(role.id);
        return detailed || role;
      }),
    );

    return NextResponse.json({
      roles: rolesWithPermissions,
      permissions,
    });
  } catch (error) {
    console.error("Get roles error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const canManage = await hasPermission(session.userId, "manage_permissions");
    if (!canManage) {
      return NextResponse.json(
        { error: "You do not have permission to manage permissions" },
        { status: 403 },
      );
    }

    const { name, description, permissionIds } = await request.json();

    if (!name || !permissionIds || !Array.isArray(permissionIds)) {
      return NextResponse.json(
        { error: "Invalid request: name and permissionIds are required" },
        { status: 400 },
      );
    }

    const roleId = await createRole(name, description || "", permissionIds);

    // Log audit action
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    await logAuditAction(
      session.userId,
      "create_role",
      "role",
      roleId,
      { name, description, permissionIds },
      clientIp,
    );

    return NextResponse.json({ roleId, message: "Role created successfully" });
  } catch (error) {
    console.error("Create role error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const canManage = await hasPermission(session.userId, "manage_permissions");
    if (!canManage) {
      return NextResponse.json(
        { error: "You do not have permission to manage permissions" },
        { status: 403 },
      );
    }

    const { roleId, name, description, permissionIds } = await request.json();

    if (!roleId || !name || !permissionIds || !Array.isArray(permissionIds)) {
      return NextResponse.json(
        {
          error:
            "Invalid request: roleId, name, and permissionIds are required",
        },
        { status: 400 },
      );
    }

    // Check if role exists and is not a default role
    if (roleId <= 2) {
      return NextResponse.json(
        { error: "Cannot modify default roles" },
        { status: 403 },
      );
    }

    await updateRole(roleId, name, description || "", permissionIds);

    // Log audit action
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    await logAuditAction(
      session.userId,
      "update_role",
      "role",
      roleId,
      { name, description, permissionIds },
      clientIp,
    );

    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const canManage = await hasPermission(session.userId, "manage_permissions");
    if (!canManage) {
      return NextResponse.json(
        { error: "You do not have permission to manage permissions" },
        { status: 403 },
      );
    }

    const { roleId } = await request.json();

    if (!roleId) {
      return NextResponse.json(
        { error: "Invalid request: roleId is required" },
        { status: 400 },
      );
    }

    if (roleId <= 2) {
      return NextResponse.json(
        { error: "Cannot delete default roles" },
        { status: 403 },
      );
    }

    await deleteRole(roleId);

    // Log audit action
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    await logAuditAction(
      session.userId,
      "delete_role",
      "role",
      roleId,
      null,
      clientIp,
    );

    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Delete role error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}

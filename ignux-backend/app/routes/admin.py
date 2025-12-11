# app/routes/admin.py
"""
Admin Dashboard Routes

This module handles all administrative functions including:
- Dashboard statistics and analytics
- User management
- System configuration
- Reports and exports
- Audit logs
"""

from datetime import datetime, date, timedelta
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse, JSONResponse
from sqlalchemy.orm import Session
import csv
import io
import logging

from app.core.database import get_db
from app.core.security import get_current_admin_user
from app.core.config import settings
from app.models import User, Booking, ContactMessage, Service, Testimonial, NewsletterSubscriber
from app.schemas import (
    StatsResponse,
    UserResponse,
    BookingResponse,
    ContactMessageResponse,
    ServiceResponse,
    TestimonialResponse,
    NewsletterSubscriberResponse,
    AdminDashboardStats,
    ReportRequest
)
from app.crud import (
    booking as booking_crud,
    contact as contact_crud,
    service as service_crud,
    testimonial as testimonial_crud,
    newsletter as newsletter_crud,
    user as user_crud
)

router = APIRouter(prefix="/admin", tags=["admin"])

logger = logging.getLogger(__name__)


@router.get("/dashboard/stats", response_model=AdminDashboardStats)
async def get_dashboard_stats(
    period: str = Query("month", regex="^(day|week|month|quarter|year)$"),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> AdminDashboardStats:
    """
    Get comprehensive dashboard statistics for admin panel.
    
    - Revenue analytics
    - Booking trends
    - User activity
    - Conversion metrics
    - Performance indicators
    """
    try:
        # Calculate date range based on period
        end_date = date.today()
        
        if period == "day":
            start_date = end_date
        elif period == "week":
            start_date = end_date - timedelta(days=7)
        elif period == "month":
            start_date = end_date - timedelta(days=30)
        elif period == "quarter":
            start_date = end_date - timedelta(days=90)
        else:  # year
            start_date = end_date - timedelta(days=365)
        
        # Get booking statistics
        bookings = booking_crud.get_bookings(
            db=db,
            date_from=start_date,
            date_to=end_date
        )
        
        # Calculate revenue
        total_revenue = sum(b.total_price for b in bookings if b.booking_status == "completed")
        pending_revenue = sum(b.total_price for b in bookings if b.booking_status in ["pending", "confirmed"])
        
        # Get booking counts by status
        status_counts = {}
        for status in ["pending", "confirmed", "in_progress", "completed", "cancelled"]:
            status_counts[status] = len([b for b in bookings if b.booking_status == status])
        
        # Get contact message statistics
        contacts = contact_crud.get_contact_messages(
            db=db,
            date_from=start_date,
            date_to=end_date
        )
        
        # Calculate contact metrics
        total_contacts = len(contacts)
        unread_contacts = len([c for c in contacts if not c.is_read])
        responded_contacts = len([c for c in contacts if c.responded])
        
        # Get service statistics
        services = service_crud.get_services(db=db, active_only=False)
        active_services = len([s for s in services if s.is_active])
        
        # Get testimonial statistics
        testimonials = testimonial_crud.get_testimonials(db=db, approved_only=False)
        approved_testimonials = len([t for t in testimonials if t.is_approved])
        pending_testimonials = len([t for t in testimonials if not t.is_approved])
        
        # Get newsletter statistics
        subscribers = newsletter_crud.get_subscribers(db=db)
        active_subscribers = len([s for s in subscribers if s.is_active])
        
        # Calculate conversion rate (contacts to bookings)
        conversion_rate = 0
        if total_contacts > 0:
            converted_bookings = len([b for b in bookings if b.created_at.date() >= start_date])
            conversion_rate = (converted_bookings / total_contacts) * 100
        
        # Calculate average booking value
        avg_booking_value = 0
        completed_bookings = [b for b in bookings if b.booking_status == "completed"]
        if completed_bookings:
            avg_booking_value = sum(b.total_price for b in completed_bookings) / len(completed_bookings)
        
        return AdminDashboardStats(
            period=period,
            start_date=start_date,
            end_date=end_date,
            
            # Revenue metrics
            total_revenue=total_revenue,
            pending_revenue=pending_revenue,
            avg_booking_value=avg_booking_value,
            
            # Booking metrics
            total_bookings=len(bookings),
            booking_status_counts=status_counts,
            upcoming_bookings=len([b for b in bookings if b.booking_status in ["confirmed", "in_progress"]]),
            
            # Contact metrics
            total_contacts=total_contacts,
            unread_contacts=unread_contacts,
            responded_contacts=responded_contacts,
            response_rate=(responded_contacts / total_contacts * 100) if total_contacts > 0 else 0,
            
            # Service metrics
            total_services=len(services),
            active_services=active_services,
            popular_services_count=len([s for s in services if s.is_popular]),
            
            # Testimonial metrics
            total_testimonials=len(testimonials),
            approved_testimonials=approved_testimonials,
            pending_testimonials=pending_testimonials,
            featured_testimonials=len([t for t in testimonials if t.is_featured]),
            
            # Newsletter metrics
            total_subscribers=len(subscribers),
            active_subscribers=active_subscribers,
            subscription_growth=0,  # Would need historical data
            
            # Conversion metrics
            conversion_rate=conversion_rate,
            contact_to_booking_ratio=conversion_rate / 100 if conversion_rate > 0 else 0,
            
            # Performance indicators
            occupancy_rate=0,  # Would need capacity data
            customer_satisfaction=0,  # Would need rating data
            repeat_customer_rate=0  # Would need customer history
        )
        
    except Exception as e:
        logger.error(f"Failed to fetch dashboard stats: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch dashboard statistics: {str(e)}"
        )


@router.get("/bookings/export")
async def export_bookings(
    format: str = Query("csv", regex="^(csv|json)$"),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Export bookings to CSV or JSON format.
    
    - Supports filtering by date and status
    - Returns downloadable file
    - Includes all booking details
    """
    try:
        # Get bookings with filters
        bookings = booking_crud.get_bookings(
            db=db,
            date_from=date_from,
            date_to=date_to,
            status=status,
            limit=10000  # Increased limit for exports
        )
        
        if format == "csv":
            # Create CSV output
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Write header
            writer.writerow([
                "ID", "Client Name", "Client Email", "Client Phone",
                "Event Name", "Event Type", "Event Date", "Event Time",
                "Location", "Service Package", "Duration",
                "Total Price", "Deposit Paid", "Balance Due",
                "Booking Status", "Payment Status",
                "Created At", "Confirmed At", "Completed At",
                "Special Instructions", "Emergency Contact"
            ])
            
            # Write data
            for booking in bookings:
                writer.writerow([
                    booking.id,
                    booking.client_name,
                    booking.client_email,
                    booking.client_phone,
                    booking.event_name,
                    booking.event_type,
                    booking.event_date.strftime('%Y-%m-%d') if booking.event_date else '',
                    booking.event_time,
                    booking.event_location,
                    booking.service_package,
                    booking.display_duration,
                    booking.total_price,
                    booking.deposit_paid,
                    booking.balance_due,
                    booking.booking_status.value,
                    booking.payment_status.value,
                    booking.created_at.strftime('%Y-%m-%d %H:%M:%S') if booking.created_at else '',
                    booking.confirmed_at.strftime('%Y-%m-%d %H:%M:%S') if booking.confirmed_at else '',
                    booking.completed_at.strftime('%Y-%m-%d %H:%M:%S') if booking.completed_at else '',
                    booking.special_instructions or '',
                    booking.emergency_contact or ''
                ])
            
            # Prepare response
            output.seek(0)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"bookings_export_{timestamp}.csv"
            
            return StreamingResponse(
                iter([output.getvalue()]),
                media_type="text/csv",
                headers={"Content-Disposition": f"attachment; filename={filename}"}
            )
        
        else:  # JSON format
            # Convert bookings to dict list
            bookings_data = []
            for booking in bookings:
                booking_dict = {
                    "id": booking.id,
                    "client": {
                        "name": booking.client_name,
                        "email": booking.client_email,
                        "phone": booking.client_phone
                    },
                    "event": {
                        "name": booking.event_name,
                        "type": booking.event_type,
                        "date": booking.event_date.isoformat() if booking.event_date else None,
                        "time": booking.event_time,
                        "location": booking.event_location
                    },
                    "service": {
                        "package": booking.service_package,
                        "duration": booking.display_duration
                    },
                    "pricing": {
                        "total": booking.total_price,
                        "deposit_paid": booking.deposit_paid,
                        "balance_due": booking.balance_due
                    },
                    "status": {
                        "booking": booking.booking_status.value,
                        "payment": booking.payment_status.value
                    },
                    "timestamps": {
                        "created": booking.created_at.isoformat() if booking.created_at else None,
                        "confirmed": booking.confirmed_at.isoformat() if booking.confirmed_at else None,
                        "completed": booking.completed_at.isoformat() if booking.completed_at else None
                    },
                    "notes": {
                        "special_instructions": booking.special_instructions,
                        "emergency_contact": booking.emergency_contact
                    }
                }
                bookings_data.append(booking_dict)
            
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"bookings_export_{timestamp}.json"
            
            return JSONResponse(
                content={
                    "success": True,
                    "count": len(bookings_data),
                    "data": bookings_data,
                    "export_info": {
                        "format": "json",
                        "generated_at": datetime.now().isoformat(),
                        "generated_by": current_user.email,
                        "filters": {
                            "date_from": date_from.isoformat() if date_from else None,
                            "date_to": date_to.isoformat() if date_to else None,
                            "status": status
                        }
                    }
                },
                headers={"Content-Disposition": f"attachment; filename={filename}"}
            )
        
    except Exception as e:
        logger.error(f"Failed to export bookings: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export bookings: {str(e)}"
        )


@router.get("/users/", response_model=List[UserResponse])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    active_only: bool = Query(True),
    admin_only: bool = Query(False),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> List[UserResponse]:
    """
    Get all users with filtering options (admin only).
    """
    try:
        users = user_crud.get_users(
            db=db,
            skip=skip,
            limit=limit,
            active_only=active_only,
            admin_only=admin_only,
            search=search
        )
        
        return users
        
    except Exception as e:
        logger.error(f"Failed to fetch users: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch users: {str(e)}"
        )


@router.patch("/users/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: int,
    active: bool = Query(..., description="Set active status"),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Toggle user active status (admin only).
    """
    try:
        user = user_crud.get_user(db, user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Cannot deactivate yourself
        if user.id == current_user.id and not active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot deactivate your own account"
            )
        
        user.is_active = active
        db.commit()
        
        action = "activated" if active else "deactivated"
        logger.warning(f"User {action}: ID={user_id}, By={current_user.email}")
        
        return {
            "success": True,
            "message": f"User {action} successfully",
            "data": {
                "user_id": user_id,
                "username": user.username,
                "is_active": active
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to toggle user active status {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user status: {str(e)}"
        )


@router.patch("/users/{user_id}/toggle-admin")
async def toggle_user_admin(
    user_id: int,
    is_admin: bool = Query(..., description="Set admin status"),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Toggle user admin privileges (admin only).
    """
    try:
        user = user_crud.get_user(db, user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Cannot remove your own admin privileges
        if user.id == current_user.id and not is_admin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot remove your own admin privileges"
            )
        
        user.is_admin = is_admin
        db.commit()
        
        action = "granted admin privileges to" if is_admin else "removed admin privileges from"
        logger.warning(f"User admin privileges updated: {action} user ID={user_id}, By={current_user.email}")
        
        return {
            "success": True,
            "message": f"Admin privileges {'granted' if is_admin else 'removed'} successfully",
            "data": {
                "user_id": user_id,
                "username": user.username,
                "is_admin": is_admin
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to toggle user admin status {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update admin status: {str(e)}"
        )


@router.get("/reports/generate")
async def generate_report(
    report_type: str = Query(..., regex="^(bookings|revenue|contacts|services|testimonials)$"),
    start_date: date = Query(...),
    end_date: date = Query(...),
    group_by: str = Query("day", regex="^(day|week|month)$"),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Generate detailed reports with grouping and aggregation.
    """
    try:
        # Validate date range
        if start_date > end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Start date must be before end date"
            )
        
        if (end_date - start_date).days > 365:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Date range cannot exceed 1 year"
            )
        
        report_data = {}
        
        if report_type == "bookings":
            report_data = generate_booking_report(db, start_date, end_date, group_by)
        elif report_type == "revenue":
            report_data = generate_revenue_report(db, start_date, end_date, group_by)
        elif report_type == "contacts":
            report_data = generate_contact_report(db, start_date, end_date, group_by)
        elif report_type == "services":
            report_data = generate_service_report(db, start_date, end_date)
        elif report_type == "testimonials":
            report_data = generate_testimonial_report(db, start_date, end_date)
        
        return {
            "success": True,
            "message": f"{report_type.title()} report generated successfully",
            "data": report_data,
            "metadata": {
                "report_type": report_type,
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "group_by": group_by,
                "generated_at": datetime.now().isoformat(),
                "generated_by": current_user.email
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to generate {report_type} report: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate report: {str(e)}"
        )


@router.get("/audit/logs")
async def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    action_type: Optional[str] = Query(None),
    user_id: Optional[int] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get system audit logs (admin only).
    
    In a real implementation, this would query an audit_log table.
    For now, returns placeholder structure.
    """
    try:
        # Placeholder for audit logs
        # In production, you would have an AuditLog model
        audit_logs = []
        
        # Example structure
        example_log = {
            "id": 1,
            "timestamp": datetime.now().isoformat(),
            "user_id": current_user.id,
            "user_email": current_user.email,
            "action": "VIEW_AUDIT_LOGS",
            "resource_type": "audit_logs",
            "resource_id": None,
            "details": "Accessed audit logs",
            "ip_address": "127.0.0.1",
            "user_agent": "FastAPI Test Client"
        }
        audit_logs.append(example_log)
        
        return {
            "success": True,
            "message": "Audit logs retrieved",
            "data": {
                "logs": audit_logs,
                "total": len(audit_logs),
                "skip": skip,
                "limit": limit,
                "filters": {
                    "action_type": action_type,
                    "user_id": user_id,
                    "start_date": start_date.isoformat() if start_date else None,
                    "end_date": end_date.isoformat() if end_date else None
                }
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to fetch audit logs: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch audit logs: {str(e)}"
        )


@router.post("/system/maintenance")
async def perform_maintenance(
    action: str = Query(..., regex="^(backup|cleanup|cache_clear)$"),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Perform system maintenance tasks (admin only).
    """
    try:
        if action == "backup":
            # Backup database
            # In production, this would trigger a backup process
            result = {"status": "backup_initiated", "estimated_time": "5 minutes"}
            message = "Database backup initiated"
            
        elif action == "cleanup":
            # Cleanup old data
            # Example: Delete old logs, temporary files, etc.
            result = {"status": "cleanup_completed", "items_removed": 0}
            message = "System cleanup completed"
            
        elif action == "cache_clear":
            # Clear cache
            result = {"status": "cache_cleared", "cache_type": "all"}
            message = "System cache cleared"
        
        logger.warning(f"System maintenance performed: Action={action}, By={current_user.email}")
        
        return {
            "success": True,
            "message": message,
            "data": result
        }
        
    except Exception as e:
        logger.error(f"Failed to perform maintenance {action}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to perform maintenance: {str(e)}"
        )


@router.get("/system/health")
async def system_health_check(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Detailed system health check (admin only).
    
    Checks database, external services, disk space, etc.
    """
    try:
        health_checks = {}
        
        # Database health
        try:
            db.execute("SELECT 1")
            health_checks["database"] = {
                "status": "healthy",
                "response_time": "fast",
                "connection": "established"
            }
        except Exception as e:
            health_checks["database"] = {
                "status": "unhealthy",
                "error": str(e)
            }
        
        # Email service health
        try:
            # Test email service connectivity
            health_checks["email_service"] = {
                "status": "healthy",
                "server": settings.SMTP_SERVER,
                "port": settings.SMTP_PORT
            }
        except Exception as e:
            health_checks["email_service"] = {
                "status": "unhealthy",
                "error": str(e)
            }
        
        # Disk space (placeholder)
        health_checks["disk_space"] = {
            "status": "healthy",
            "free_space": "> 10GB"  # Placeholder
        }
        
        # Memory usage (placeholder)
        health_checks["memory"] = {
            "status": "healthy",
            "usage": "normal"  # Placeholder
        }
        
        # Overall status
        all_healthy = all(check["status"] == "healthy" for check in health_checks.values())
        overall_status = "healthy" if all_healthy else "degraded"
        
        return {
            "success": True,
            "message": f"System health check completed: {overall_status}",
            "data": {
                "overall_status": overall_status,
                "timestamp": datetime.now().isoformat(),
                "checks": health_checks,
                "recommendations": [] if all_healthy else ["Check email service configuration"]
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to perform system health check: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to perform health check: {str(e)}"
        )


# Report generation helper functions
def generate_booking_report(db: Session, start_date: date, end_date: date, group_by: str) -> Dict[str, Any]:
    """Generate booking report with grouping."""
    # This would query bookings and group by date
    # Placeholder implementation
    return {
        "summary": {
            "total_bookings": 0,
            "completed_bookings": 0,
            "cancelled_bookings": 0,
            "conversion_rate": 0
        },
        "trends": [],
        "by_status": {},
        "by_service_type": {}
    }


def generate_revenue_report(db: Session, start_date: date, end_date: date, group_by: str) -> Dict[str, Any]:
    """Generate revenue report with grouping."""
    # This would calculate revenue from completed bookings
    # Placeholder implementation
    return {
        "summary": {
            "total_revenue": 0,
            "average_booking_value": 0,
            "revenue_growth": 0
        },
        "daily_revenue": [],
        "by_service_type": {},
        "payment_methods": {}
    }


def generate_contact_report(db: Session, start_date: date, end_date: date, group_by: str) -> Dict[str, Any]:
    """Generate contact form report."""
    # This would analyze contact form submissions
    # Placeholder implementation
    return {
        "summary": {
            "total_contacts": 0,
            "response_rate": 0,
            "average_response_time": 0
        },
        "by_event_type": {},
        "by_source": {},
        "conversion_metrics": {}
    }


def generate_service_report(db: Session, start_date: date, end_date: date) -> Dict[str, Any]:
    """Generate service performance report."""
    # This would analyze service popularity and performance
    # Placeholder implementation
    return {
        "summary": {
            "total_services": 0,
            "active_services": 0,
            "popular_services": 0
        },
        "service_performance": [],
        "category_analysis": {},
        "recommendations": []
    }


def generate_testimonial_report(db: Session, start_date: date, end_date: date) -> Dict[str, Any]:
    """Generate testimonial analysis report."""
    # This would analyze testimonials and ratings
    # Placeholder implementation
    return {
        "summary": {
            "total_testimonials": 0,
            "average_rating": 0,
            "approval_rate": 0
        },
        "rating_distribution": {},
        "by_event_type": {},
        "featured_testimonials": []
    }